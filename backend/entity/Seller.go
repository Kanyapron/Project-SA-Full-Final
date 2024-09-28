package entity

import "gorm.io/gorm"

type Seller struct {
	gorm.Model
	StudentID        string `gorm:"unique"`
	Major            string
	PictureStudentID string `gorm:"type:longtext"`

	// MemberID uint       `gorm:"unique"`
	MemberID uint
	Member   Member `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	
	Products []Products `gorm:"foreignKey:SellerID"`

	YearsID uint
	Years Years `gorm:"foreignKey:YearsID"`

	InstituteOfID uint
	InstituteOf InstituteOf `gorm:"foreignKey:InstituteOfID"`
}
