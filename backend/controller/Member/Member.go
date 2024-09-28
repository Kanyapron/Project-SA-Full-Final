package Member

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)


func CreateMember(c *gin.Context) { // สร้างข้อมูลสมาชิก
	var member entity.Member

	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	hashedPassword, err := config.HashPassword(member.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	m := entity.Member{
		Username:    member.Username,
		Password:    hashedPassword,
		Email:       member.Email,
		FirstName:   member.FirstName,
		LastName:    member.LastName,
		PhoneNumber: member.PhoneNumber,
		Address:     member.Address,
		ProfilePic:  member.ProfilePic,
	}

	if err := db.Create(&m).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": m})
}

// GET /members/:id
func GetMember(c *gin.Context) { // ดึงข้อมูลสมาชิกตาม ID
	ID := c.Param("id")
	var member entity.Member

	db := config.DB()
	
	result := db.First(&member, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, member)
}

// GET /members
func ListMembers(c *gin.Context) {
	var members []entity.Member

	db := config.DB()
	result := db.Find(&members)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve members"})
		return
	}
	c.JSON(http.StatusOK, members)
}

// DELETE /members/:id
func DeleteMember(c *gin.Context) { // ลบข้อมูลสมาชิกตาม ID
	id := c.Param("id")
	db := config.DB()
	if tx := db.Delete(&entity.Member{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /members/:id
func UpdateMember(c *gin.Context) { // อัพเดทข้อมูลสมาชิกตาม ID
	var member entity.Member

	MemberID := c.Param("id")

	db := config.DB()
	result := db.First(&member, MemberID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&member)

	if err := db.Model(&member).Updates(member).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update member"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

