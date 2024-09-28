package entity

import "gorm.io/gorm"

type Years struct {
	gorm.Model
	Name string

	Seller []Seller `gorm:"foreignKey:YearsID"`
	// Member []Member `gorm:"foreignKey:YearsID"`
}