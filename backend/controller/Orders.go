package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /orders
func CreateOrder(c *gin.Context) { // สร้างคำสั่งซื้อ
	var order entity.Order

	// bind เข้าตัวแปร order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบว่า MemberID กับ SellerID เชื่อมต่อกันหรือไม่
	var seller entity.Seller
	if err := db.Where("member_id = ?", order.MemberID).First(&seller).Error; err == nil { // พบ Seller ที่มี MemberID เดียวกัน
		if seller.ID == *order.SellerID { // ถ้า SellerID ที่พบตรงกับ SellerID ที่ส่งมา
			c.JSON(http.StatusBadRequest, gin.H{"error": "Buyer cannot purchase their own product"})
			return
		}
	}

	// สร้าง Order
	o := entity.Order{
		Quantity:    order.Quantity,
		Total_price: order.Total_price,
		MemberID:    order.MemberID,
		SellerID:    order.SellerID,
	}

	// บันทึก
	if err := db.Create(&o).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": o})
}



// GET /orders/:id
func GetOrder(c *gin.Context) { // เข้าถึงคำสั่งซื้อตาม id
	ID := c.Param("id")
	var order entity.Order

	db := config.DB()
	result := db.Preload("Member").Preload("Seller").Preload("Product_Orders").First(&order, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, order)
}

// PATCH /orders/:id
func UpdateOrder(c *gin.Context) { //อัพเดตคำสั่งซื้อตาม id
	var order entity.Order

	OrderID := c.Param("id")

	db := config.DB()
	result := db.First(&order, OrderID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&order)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /orders/:id
func DeleteOrder(c *gin.Context) { // ลบคำสั่งซื้อตาม id
	id := c.Param("id")
	db := config.DB()

	// เริ่มต้นการ transaction
	tx := db.Begin()

	// ลบข้อมูลในตาราง products_order ที่อ้างอิงถึงคำสั่งซื้อ
	if err := tx.Exec("DELETE FROM products_orders WHERE order_id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related products_order"})
		return
	}

	// ลบข้อมูลในตาราง orders
	if tx := tx.Exec("DELETE FROM orders WHERE id = ?", id); tx.RowsAffected == 0 {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	// ยืนยันการ transaction
	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// GET /orders/member/:memberId
func GetOrdersByMemberID(c *gin.Context) { // เข้าถึงคำสั่งซื้อโดย MemberID
	memberID := c.Param("memberId")
	var orders []entity.Order

	db := config.DB()

	// ดึงคำสั่งซื้อที่เชื่อมโยงกับ MemberID
	result := db.Preload("Member").Preload("Seller").Preload("Product_Orders").Where("member_id = ?", memberID).Find(&orders)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	// ตรวจสอบว่า MemberID มีคำสั่งซื้อหรือไม่
	if len(orders) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No orders found for this member"})
		return
	}

	c.JSON(http.StatusOK, orders)
}



// GET /orders/member/:memberId/product/:productId
func GetOrdersByProductIDAndMemberID(c *gin.Context) { // เข้าถึงคำสั่งซื้อโดย ProductID และ MemberID
	memberID := c.Param("memberId")
	productID := c.Param("productId")
	var orders []entity.Order

	db := config.DB()

	// ดึงคำสั่งซื้อที่เชื่อมโยงกับ MemberID และ ProductID
	result := db.Joins("JOIN products_orders ON products_orders.order_id = orders.id").
		Joins("JOIN products ON products.id = products_orders.product_id").
		Where("orders.member_id = ? AND products.id = ?", memberID, productID).
		Find(&orders)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	// ตรวจสอบว่า MemberID และ ProductID มีคำสั่งซื้อหรือไม่
	if len(orders) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No orders found for this member and product"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetOrdersByProductIDAndSellerID(c *gin.Context) { // เข้าถึงคำสั่งซื้อโดย ProductID และ SellerID
	sellerID := c.Param("sellerId")
	productID := c.Param("productId")
	var orders []entity.Order

	db := config.DB()

	// ใช้ alias เพื่อลดความไม่ชัดเจนของคอลัมน์
	result := db.Joins("JOIN products_orders ON products_orders.order_id = orders.id").
		Joins("JOIN products ON products.id = products_orders.product_id").
		Joins("JOIN orders AS o ON o.id = products_orders.order_id").
		Where("o.seller_id = ? AND products.id = ?", sellerID, productID).
		Find(&orders)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	// ตรวจสอบว่า SellerID และ ProductID มีคำสั่งซื้อหรือไม่
	if len(orders) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No orders found for this seller and product"})
		return
	}

	c.JSON(http.StatusOK, orders)
}
