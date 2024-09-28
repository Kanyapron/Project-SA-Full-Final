package entity

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	NameCategory string

	Products []Products `gorm:"foreignKey:CategoryID"`
}