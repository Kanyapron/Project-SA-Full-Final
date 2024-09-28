// package controller

// import (
// 	"Songthorsut/config"
// 	"Songthorsut/entity"
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// )

// // POST /sellers
// func CreateSeller(c *gin.Context) {
// 	var seller entity.Seller

// 	// bind เข้าตัวแปร seller
// 	if err := c.ShouldBindJSON(&seller); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	db := config.DB()

// 	// ตรวจสอบว่า Member มีอยู่หรือไม่
// 	var member entity.Member
// 	db.First(&member, seller.MemberID)
// 	if member.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
// 		return
// 	}

// 	// ตรวจสอบว่า Member นี้มี Seller อยู่แล้วหรือยัง
// 	var existingSeller entity.Seller
// 	db.Where("member_id = ?", seller.MemberID).First(&existingSeller)
// 	if existingSeller.ID != 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Member already has a seller record"})
// 		return
// 	}

// 	// สร้าง Seller
// 	s := entity.Seller{
// 		StudentID:        seller.StudentID,
// 		Major:            seller.Major,
// 		YearsID:          seller.YearsID,
// 		InstituteOfID:    seller.InstituteOfID,
// 		PictureStudentID: seller.PictureStudentID,
// 		// MemberID:         seller.MemberID, // เชื่อมกับ Member

// 	}

// 	// บันทึก
// 	if err := db.Create(&s).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": s})
// }

// // GET /sellers/:id
// func GetSeller(c *gin.Context) {
// 	ID := c.Param("id")
// 	var seller entity.Seller

// 	db := config.DB()

// 	// Join table sellers กับ members โดยใช้ member_id
// 	result := db.Preload("Member").First(&seller, ID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, seller)
// }

// // PATCH /sellers/:id
// func UpdateSeller(c *gin.Context) {
// 	var seller entity.Seller
// 	SellerID := c.Param("id")

// 	db := config.DB()
// 	result := db.First(&seller, SellerID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&seller); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
// 		return
// 	}

// 	result = db.Model(&seller).Updates(seller)
// 	if result.Error != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
// }

// // DELETE /sellers/:id
// func DeleteSeller(c *gin.Context) { //ลบข้อมูลผู้ขายตาม id
// 	id := c.Param("id")
// 	db := config.DB()
// 	if tx := db.Exec("DELETE FROM sellers WHERE id = ?", id); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
// }

// ทดสอบอัปรูป
package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /sellers
func CreateSeller(c *gin.Context) {
	var seller entity.Seller

	// Bind the request data to the seller struct
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// Check if the Member already exists (assuming MemberID is unique)
	var existingSeller entity.Seller
	if err := db.Where("member_id = ?", seller.MemberID).First(&existingSeller).Error; err == nil {
		// If seller with the same MemberID already exists, return an error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seller already exists for this member"})
		return
	}

	// Create the new seller
	newSeller := entity.Seller{
		StudentID:        seller.StudentID,
		Major:            seller.Major,
		YearsID:          seller.YearsID,
		InstituteOfID:    seller.InstituteOfID,
		PictureStudentID: seller.PictureStudentID,
		MemberID:         seller.MemberID, // Assuming this field links to Member
	}

	// Save the new seller to the database
	if err := db.Create(&newSeller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created successfully", "data": newSeller})
}

// GET /sellers/:id
func GetSeller(c *gin.Context) {
	ID := c.Param("id")
	var seller entity.Seller

	db := config.DB()

	// Join table sellers กับ members โดยใช้ member_id
	result := db.Preload("Member").First(&seller, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, seller)
}


  

// PATCH /sellers/:id
func UpdateSeller(c *gin.Context) {
	var seller entity.Seller
	SellerID := c.Param("id")

	db := config.DB()
	result := db.First(&seller, SellerID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Model(&seller).Updates(seller)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /sellers/:id
func DeleteSeller(c *gin.Context) { //ลบข้อมูลผู้ขายตาม id
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM sellers WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// // GET /sellers/member/:member_id ทำงงานได้แล้วห้ามแก้ไข!!!!!!!!!!

// func GetSellerByMemberId(c *gin.Context) {
//     // Get the member_id from the URL parameters
//     memberID := c.Param("member_id")

//     // Initialize the Seller entity
//     var seller entity.Seller

//     // Get the database instance
//     db := config.DB()

//     // Preload the associated Member and find the Seller by member_id
//     result := db.Preload("Member").Where("member_id = ?", memberID).First(&seller)

//     // If no seller is found, return a 404 error
//     if result.Error != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found with the provided MemberID"})
//         return
//     }

//     // If successful, return the seller with status 200
//     c.JSON(http.StatusOK, seller)
// }





// GET /sellers/member/:member_id ทดสอบเฉยๆ ลบได้

func GetSellerByMemberId(c *gin.Context) {
    // Get the member_id from the URL parameters
    memberID := c.Param("member_id")

    // Initialize the Seller entity
    var seller entity.Seller

    // Get the database instance
    db := config.DB()

    // Preload the associated Member and find the Seller by member_id
    result := db.Preload("Member").Where("member_id = ?", memberID).First(&seller)

    // If no seller is found, return a 404 error
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found with the provided MemberID"})
        return
    }

    // Set the SellerID from the retrieved seller
    sellerID := seller.ID  // Assuming the ID field represents the seller ID

    // Log the seller ID if needed (for debugging)
    fmt.Printf("Seller ID for Member %s: %d\n", memberID, sellerID)

    // If successful, return the seller with status 200
    c.JSON(http.StatusOK, gin.H{
        "seller": seller,
        "seller_id": sellerID,
    })
}





//เพิ่ม seller id ทดสอบ
//Get /sellers/:seller_id/member/:member_id

func GetSellerIdByMemberID(c *gin.Context) {
    // Get the seller_id and member_id from the URL parameters
    sellerID := c.Param("seller_id")
    memberID := c.Param("member_id")

    // Initialize the Seller entity
    var seller entity.Seller

    // Get the database instance
    db := config.DB()

    // Preload the associated Member and find the Seller by both seller_id and member_id
    result := db.Preload("Member").Where("id = ? AND member_id = ?", sellerID, memberID).First(&seller)

    // If no seller is found, return a 404 error
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found with the provided SellerID and MemberID"})
        return
    }

    // If successful, return the seller including the seller_id and member_id with status 200
    c.JSON(http.StatusOK, gin.H{
        "seller_id": seller.ID, // Assuming seller_id is stored in the ID field
        "member_id": seller.MemberID, // Assuming member_id is stored in the MemberID field of the Seller entity
        "seller":    seller,    // Send the complete seller information
    })
}



func GetMemberBySeller(c *gin.Context) {
    sellerID := c.Param("id") // รับ seller_id จาก URL

    var seller entity.Seller   // สร้างตัวแปรเก็บข้อมูล Seller

    db := config.DB()          // เชื่อมต่อกับฐานข้อมูล

    // ดึงข้อมูล Seller พร้อมกับ Member ที่สัมพันธ์กัน (Preload)
    result := db.Preload("Member").Where("id = ?", sellerID).First(&seller)

    // ตรวจสอบว่าพบข้อมูล Seller หรือไม่
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
        return
    }

    // ตรวจสอบว่ามี Member ที่สัมพันธ์กันหรือไม่
    if seller.MemberID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
        return
    }

    // ส่งข้อมูล Member กลับไปในรูปแบบ JSON
    c.JSON(http.StatusOK, seller.Member)
}


// GET /sellers/StudentID/:studentid
func GetSellerByStudentId(c *gin.Context) {
	studentID := c.Param("studentid") // Extract the StudentID from the URL parameter
	var seller entity.Seller

	db := config.DB()

	// Search for the seller by the StudentID, and preload the Member table (if necessary)
	result := db.Preload("Member").Where("student_id = ?", studentID).First(&seller)
	if result.Error != nil {
		// If no seller is found or another error occurs, return a 404 Not Found status with the error message
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found: " + result.Error.Error()})
		return
	}

	// If the seller is found, return the seller's data
	c.JSON(http.StatusOK, seller)
}