package entity

import "gorm.io/gorm"

type InstituteOf struct {
	gorm.Model
	NameInstituteOf string

	Seller []Seller `gorm:"foreignKey:InstituteOfID"`
	// Member []Member `gorm:"foreignKey:InstituteOfID"`
}