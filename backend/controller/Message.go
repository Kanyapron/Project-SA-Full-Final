package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"
	"github.com/gin-gonic/gin"
)



func GetMessages(c *gin.Context) {
    roomID := c.Param("room_id")

    var messages []entity.Message
    db := config.DB()

    result := db.Where("room_chat_id = ?", roomID).Find(&messages)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, messages)
}

func CreateMessage(c *gin.Context) {
    var request struct {
        RoomChatID    uint   `json:"room_chat_id"`
        Content       string `json:"content"`
        SenderID      uint   `json:"sender_id"`
        PictureContent string `json:"picture_content"` //-----------------------เพิ่มรูป---------------------------// เพิ่มฟิลด์สำหรับรูปภาพ
    }

    if err := c.BindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    newMessage := entity.Message{
        RoomChatID:    request.RoomChatID,
        Content:       request.Content,
        SenderID:      request.SenderID,
        PictureContent: request.PictureContent, // เก็บข้อมูลรูปภาพ
    }

    if err := db.Create(&newMessage).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Message saved successfully",
        "data":    newMessage,
    })
}


func DeleteMessage(c *gin.Context) {
    // รับ `id` จากพารามิเตอร์ของ URL
    messageID := c.Param("id")

    db := config.DB()

    // ลบข้อความที่มี `id` ตรงกับที่รับมา
    result := db.Delete(&entity.Message{}, messageID)

    if result.Error != nil {
        // ถ้ามีข้อผิดพลาดในการลบ
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    if result.RowsAffected == 0 {
        // ถ้าไม่มีแถวที่ถูกลบ (หมายความว่ามันไม่พบข้อความที่ตรงกับ `id`)
        c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
        return
    }

    // การลบสำเร็จ
    c.JSON(http.StatusOK, gin.H{"message": "Message deleted successfully"})
}