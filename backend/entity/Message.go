package entity

import "gorm.io/gorm"

// ตาราง Message เก็บข้อความที่ถูกส่งในห้องแชท
type Message struct {
    gorm.Model
    SenderID  uint      // Foreign key สำหรับ Member
    Sender    Member    `gorm:"foreignKey:SenderID"` // เชื่อมต่อกับ Member

    Content   string
    PictureContent string `gorm:"type:longtext"`

    RoomChatID uint      // Foreign key สำหรับ RoomChat
    RoomChat   RoomChat  `gorm:"foreignKey:RoomChatID"` // เชื่อมต่อกับ RoomChat
}
