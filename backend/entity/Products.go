package entity

import (
	"gorm.io/gorm"
)

type Products struct {
	gorm.Model
	Title           string
	Description     string
	Price           float32
	PictureProduct string `gorm:"type:longtext"`
	Weight          float32
	Status          string
	

	SellerID uint
	Seller   Seller `gorm:"foreignKey:SellerID"`

	CategoryID uint
	Category Category `gorm:"foreignKey:CategoryID"`

	ConditionID uint
	Condition Condition `gorm:"foreignKey:ConditionID"`

	Review          []Review `gorm:"foreignKey:products_id"`
}
