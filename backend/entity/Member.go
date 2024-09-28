package entity

import (
	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	Username   string
	Password   string
	Email      string
	FirstName  string
	LastName   string
	PhoneNumber string
	Address    string
	ProfilePic string `gorm:"type:longtext"`
	RoomChats []RoomChat `gorm:"foreignKey:MemberID"` // ความสัมพันธ์ one-to-many กับ RoomChat
	Reviews   []Review  `gorm:"foreignKey:MemberID"`

}

