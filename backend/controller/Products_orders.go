package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /products_orders
func ListProductsOrders(c *gin.Context) { //เข้าถึงข้อมูลสินค้ากับออเดอร์
	var productsOrders []entity.Products_order

	db := config.DB()
	result := db.Preload("Product").Preload("Order").Find(&productsOrders)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, productsOrders)
}

// POST /products_orders
func CreateProductsOrder(c *gin.Context) {
	var productsOrder entity.Products_order

	// bind เข้าตัวแปร productsOrder
	if err := c.ShouldBindJSON(&productsOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้าง Products_order
	po := entity.Products_order{
		ProductID: productsOrder.ProductID,
		OrderID:   productsOrder.OrderID,
	}

	// บันทึก
	if err := db.Create(&po).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": po})
}

// GET /products_orders/:id
func GetProductsOrder(c *gin.Context) {
	ID := c.Param("id")
	var productsOrder entity.Products_order

	db := config.DB()
	result := db.Preload("Product").Preload("Order").First(&productsOrder, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, productsOrder)
}

// PATCH /products_orders/:id
func UpdateProductsOrder(c *gin.Context) {
	var productsOrder entity.Products_order

	ProductsOrderID := c.Param("id")

	db := config.DB()
	result := db.First(&productsOrder, ProductsOrderID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&productsOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&productsOrder)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /products_orders/:id
func DeleteProductsOrder(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM products_orders WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}


// GET /products_orders_by_order/:order_id
func GetProductsOrdersByOrderID(c *gin.Context) {
    orderID := c.Param("order_id")
    var productsOrders []entity.Products_order

    db := config.DB()
    result := db.Preload("Product").Preload("Order").Where("order_id = ?", orderID).Find(&productsOrders)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, productsOrders)
}
