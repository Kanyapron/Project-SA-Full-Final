package controller

import (
	"Songthorsut/config"
	"Songthorsut/entity"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateRoomChat(c *gin.Context) {
    // รับค่าจาก URL path parameters
    memberIDStr := c.Param("memberID")
    sellerIDStr := c.Param("sellerID")

    // แปลงค่าจาก string เป็น uint
    memberID, err := strconv.ParseUint(memberIDStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid MemberID"})
        return
    }
    sellerID, err := strconv.ParseUint(sellerIDStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid SellerID"})
        return
    }

    db := config.DB()

    // ตรวจสอบว่า SellerID ถูกต้อง
    var seller entity.Seller
    if err := db.First(&seller, sellerID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
        return
    }

    // ตรวจสอบว่า MemberID ถูกต้อง
    var member entity.Member
    if err := db.First(&member, memberID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
        return
    }

    // ตรวจสอบว่า member_id ของ seller กับ memberID ไม่เหมือนกัน
    if seller.MemberID == uint(memberID) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Seller cannot chat with themselves"})
        return
    }

    // ตรวจสอบว่ามีห้องแชทระหว่าง Member และ Seller นี้อยู่แล้วหรือไม่
    var existingRoomChat entity.RoomChat
    if err := db.Where("member_id = ? AND seller_id = ?", memberID, sellerID).First(&existingRoomChat).Error; err == nil {
        // ถ้ามีห้องแชทนี้อยู่แล้ว ส่งข้อมูลห้องแชทเดิมกลับไป
        c.JSON(http.StatusOK, gin.H{"message": "Room already exists", "data": existingRoomChat})
        return
    }

    // สร้าง RoomChat ใหม่
    r := entity.RoomChat{
        MemberID: uint(memberID), // แปลงเป็น uint
        SellerID: uint(sellerID), // แปลงเป็น uint
        Seller:   seller,
    }

    // บันทึกห้องแชทใหม่
    if err := db.Create(&r).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": r})
}

func GetRoomChat(c *gin.Context) {
	ID := c.Param("room_id") // รับ room_id จาก URL

	var roomchat entity.RoomChat // สร้างตัวแปรเก็บข้อมูล Messages

	db := config.DB() // เชื่อมต่อกับฐานข้อมูล

	// ดึงข้อความทั้งหมดใน RoomChat ที่มี room_id ตามที่ระบุ
	results := db.Preload("Seller").Preload("Member").First(&roomchat, ID)

	// ตรวจสอบว่าพบข้อมูลหรือไม่
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	// if roomchat.RoomChatID == 0 {
	// 	c.JSON(http.StatusNoContent, gin.H{})
	// 	return
	// }
	// ส่งข้อมูล Messages กลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, roomchat)
}

func RoomChatBySellerID(c *gin.Context) {
    // รับ seller_id จาก URL
    sellerIDStr := c.Param("id")

    // แปลง string เป็น uint
    sellerID, err := strconv.ParseUint(sellerIDStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid SellerID"})
        return
    }

    var roomchats []entity.RoomChat // เก็บข้อมูลห้องแชท

    db := config.DB() // เชื่อมต่อกับฐานข้อมูล

    // ค้นหาห้องแชทที่เกี่ยวข้องกับ seller_id ที่ระบุ
    results := db.Where("seller_id = ?", uint(sellerID)).Preload("Seller").Preload("Member").Find(&roomchats)

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    if len(roomchats) == 0 {
        c.JSON(http.StatusNoContent, gin.H{"message": "No rooms found for this seller"})
        return
    }

    // ส่งข้อมูลห้องแชททั้งหมดกลับไปในรูปแบบ JSON
    c.JSON(http.StatusOK, roomchats)
}


func RoomChatByMemberID(c *gin.Context) {
    // รับ member_id จาก URL
    memberIDStr := c.Param("id")

    // แปลง string เป็น uint
    memberID, err := strconv.ParseUint(memberIDStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid MemberID"})
        return
    }

    var roomchats []entity.RoomChat // เก็บข้อมูลห้องแชท

    db := config.DB() // เชื่อมต่อกับฐานข้อมูล

    // ค้นหาห้องแชทที่เกี่ยวข้องกับ member_id ที่ระบุ
    results := db.Where("member_id = ?", uint(memberID)).Preload("Seller").Preload("Member").Find(&roomchats)

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }

    if len(roomchats) == 0 {
        c.JSON(http.StatusNoContent, gin.H{"message": "No rooms found for this member"})
        return
    }

    // ส่งข้อมูลห้องแชททั้งหมดกลับไปในรูปแบบ JSON
    c.JSON(http.StatusOK, roomchats)
}

func GetRoomChatByMemberAndSellerID(c *gin.Context) {
	memberIDStr := c.Param("member_id")
	sellerIDStr := c.Param("seller_id")

	memberID, err := strconv.ParseUint(memberIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid MemberID"})
		return
	}
	sellerID, err := strconv.ParseUint(sellerIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid SellerID"})
		return
	}

	var roomchat entity.RoomChat
	db := config.DB()
	results := db.Where("member_id = ? AND seller_id = ?", uint(memberID), uint(sellerID)).Preload("Seller").Preload("Member").First(&roomchat)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, roomchat)
}


