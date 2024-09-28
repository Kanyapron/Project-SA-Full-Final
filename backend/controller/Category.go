package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"
	"github.com/gin-gonic/gin"
)

// GET /
func GetCategory(c *gin.Context) {
	var category []entity.Category

	db := config.DB()

	db.Find(&category)

	c.JSON(http.StatusOK, &category)
}
