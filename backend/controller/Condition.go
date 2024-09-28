package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"
	"github.com/gin-gonic/gin"
)

// GET /
func GetCondition(c *gin.Context) {
	var condition []entity.Condition

	db := config.DB()

	db.Find(&condition)

	c.JSON(http.StatusOK, &condition)
}

