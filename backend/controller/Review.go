package controller

import (
	"net/http"
	"gorm.io/gorm"

	"Songthorsut/config"
	"Songthorsut/entity"
	"github.com/gin-gonic/gin"
)

// CreateReview - สร้างข้อมูลรีวิวใหม่
func CreateReview(c *gin.Context) {
	var review entity.Review

	// ตรวจสอบข้อมูล JSON ที่ส่งมา
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เชื่อมต่อฐานข้อมูล
	db := config.DB()

	// ตรวจสอบว่าสินค้าที่รีวิวมีอยู่ในระบบหรือไม่
	var product entity.Products
	if err := db.First(&product, review.ProductsID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสินค้าดังกล่าว"})
		return
	}

	// ตรวจสอบว่ามีสมาชิกอยู่ในระบบหรือไม่
	var member entity.Member
	if err := db.First(&member, review.MemberID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสมาชิกดังกล่าว"})
		return
	}

	// ตรวจสอบว่าสมาชิกเป็นผู้ขายสินค้านี้หรือไม่
	// if product.SellerID != nil && member.ID == *product.SellerID {
	// 	c.JSON(http.StatusForbidden, gin.H{"error": "คุณไม่สามารถรีวิวสินค้าของตัวเองได้"})
	// 	return
	// }

	// ตรวจสอบว่ามีรีวิวจากสมาชิกนี้อยู่แล้วหรือไม่
	var existingReview entity.Review
	if err := db.Where("products_id = ? AND member_id = ?", review.ProductsID, review.MemberID).First(&existingReview).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "คุณได้รีวิวสินค้านี้ไปแล้ว"})
		return
	}

	// สร้างรีวิวใหม่
	r := entity.Review{
		Rating:     review.Rating,
		Comment:    review.Comment,
		ProductsID: review.ProductsID,
		MemberID:   review.MemberID, // บันทึก MemberID ที่ส่งมา
	}

	// บันทึกรีวิวลงฐานข้อมูล
	if err := db.Create(&r).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งผลลัพธ์กลับไปยังผู้ใช้
	c.JSON(http.StatusCreated, gin.H{"message": "รีวิวสินค้าแล้ว", "data": r})
}



// UpdateReview - อัปเดตรีวิวตาม ID
func UpdateReview(c *gin.Context) {
	var review entity.Review

	// ดึงค่า ID ของรีวิวจาก URL
	Review_id := c.Param("id")

	// เชื่อมต่อฐานข้อมูล
	db := config.DB()

	// ค้นหารีวิวตาม ID
	result := db.First(&review, Review_id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// ตรวจสอบข้อมูล JSON ที่ส่งมา
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกการแก้ไขรีวิวลงในฐานข้อมูล
	result = db.Save(&review)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	// ส่งผลลัพธ์กลับไปยังผู้ใช้
	c.JSON(http.StatusOK, gin.H{"message": "บันทึกการแก้ไขรีวิวแล้ว"})
}

// DELETE /review/:id
// DeleteReview ลบรีวิวตาม ID
func DeleteReview(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var review entity.Review

	// ตรวจสอบว่ารีวิวมีอยู่ในฐานข้อมูลหรือไม่
	if err := db.First(&review, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not find review"})
		return
	}

	// ลบรีวิว
	if err := db.Delete(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete review"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func GetAllReview(c *gin.Context) { // เข้าถึงข้อมูลMemberทั้งหมด
	var review []entity.Review

	db := config.DB()
	result := db.Find(&review)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, review)
}

// GetReviewsBySellerID - ดึงรีวิวของผู้ขายตาม sellerID
func GetReviewsBySellerID(c *gin.Context) {
    sellerID := c.Param("seller_id") // ดึง sellerID จากพารามิเตอร์ URL

    var reviews []entity.Review
    db := config.DB()

    // ดึงรีวิวที่เชื่อมโยงกับสินค้าของผู้ขายตาม sellerID
    result := db.Table("reviews").Select("reviews.*").Joins("JOIN products ON products.id = reviews.products_id").Where("products.seller_id = ?", sellerID).Find(&reviews)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    if len(reviews) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"message": "ไม่มีรีวิวสำหรับผู้ขายนี้"})
        return
    }

    c.JSON(http.StatusOK, reviews)
}
