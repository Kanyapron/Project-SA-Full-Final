package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /products
func GetProducts(c *gin.Context) { // เข้าถึงข้อมูลสินค้าทั้งหมด
	var products []entity.Products

	db := config.DB()
	result := db.Preload("Seller").Find(&products)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// POST /products
func CreateProducts(c *gin.Context) {
	var product entity.Products

	// bind เข้าตัวแปร product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า Seller มีอยู่ในระบบหรือไม่
	var seller entity.Seller
	if err := db.First(&seller, product.SellerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seller not found"})
		return
	}

	// สร้าง Product พร้อมกับข้อมูล Seller
	p := entity.Products{
		Title:           product.Title,
		Description:     product.Description,
		Price:           product.Price,
		PictureProduct: product.PictureProduct,
		Weight:          product.Weight,
		Status:          product.Status,
		CategoryID:        product.CategoryID,
		ConditionID:       product.ConditionID,
		SellerID:        seller.ID, // เชื่อมกับ Seller ที่มีอยู่
	}

	// บันทึก Product
	if err := db.Create(&p).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// โหลดข้อมูล Seller ที่เชื่อมโยงกับ Product นี้
	// db.Preload("Seller").First(&p, p.ID)

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": p})
}

// GET /products/:id
func GetProductsBYID(c *gin.Context) {
	ID := c.Param("id")
	var product entity.Products

	db := config.DB()

	// ใช้ Preload เพื่อนำข้อมูล Seller มาใน Product ด้วย
	result := db.Preload("Seller").First(&product, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

// PATCH /products/:id
func UpdateProducts(c *gin.Context) { //อัพเดตข้อมูลตาม id
	var product entity.Products

	ProductID := c.Param("id")

	db := config.DB()
	result := db.First(&product, ProductID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&product)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /products/:id
func DeleteProducts(c *gin.Context) { //ลบข้อมูลตาม id
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM products WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}



func GetProductsByMemberID(c *gin.Context) {
    memberID := c.Param("member_id")
    var products []entity.Products

    db := config.DB()

    // Query to join tables and filter by member_id
    result := db.
        Joins("JOIN products_orders ON products_orders.product_id = products.id").
        Joins("JOIN orders ON orders.id = products_orders.order_id").
        Where("orders.member_id = ?", memberID).
        Preload("Seller").
        Find(&products)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"products": products})
}



// GET /products/search/:title
func GetProductsByTitle(c *gin.Context) {
    title := c.Param("title")  // รับค่าจาก URL พารามิเตอร์
    var products []entity.Products

    db := config.DB()

    // ค้นหาสินค้าที่มี title คล้ายกับค่าที่รับมา โดยใช้ LIKE
    result := db.Where("title LIKE ?", "%"+title+"%").Preload("Seller").Find(&products)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"products": products})
}

// GET /products/seller/:seller_id
func GetProductsBySellerID(c *gin.Context) {
    sellerID := c.Param("seller_id")  // รับค่าจาก URL พารามิเตอร์
    var products []entity.Products

    db := config.DB()

    // ค้นหาสินค้าที่มี SellerID ตรงกับค่าที่รับมา
    result := db.Where("seller_id = ?", sellerID).Preload("Seller").Find(&products)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"products": products})
}


func UpdateProductsById(c *gin.Context) {
    var product entity.Products  // Ensure this is the correct struct

    ProductID := c.Param("id")

    db := config.DB()
    result := db.First(&product, ProductID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product ID not found"})
        return
    }

    if err := c.ShouldBindJSON(&product); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&product)  // Save the updated product data

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

