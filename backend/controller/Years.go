package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"
	"github.com/gin-gonic/gin"
)

// GET /genders
func GetYears(c *gin.Context) {
	var years []entity.Years

	db := config.DB()

	db.Find(&years)

	c.JSON(http.StatusOK, &years)
}