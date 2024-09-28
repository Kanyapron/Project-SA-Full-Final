package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"
	"github.com/gin-gonic/gin"
)

// GET /
func GetInstituteOf(c *gin.Context) {
	var instituteof []entity.InstituteOf

	db := config.DB()

	db.Find(&instituteof)

	c.JSON(http.StatusOK, &instituteof)
}