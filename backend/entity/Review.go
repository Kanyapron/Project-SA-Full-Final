package entity

import(
	"gorm.io/gorm"
)

type Review struct{
	gorm.Model
	Rating int
	Comment string

	MemberID  uint
	Member    *Member  `gorm:"foreignKey: MemberID"`

	ProductsID  uint
	Products    *Products  `gorm:"foreignKey: ProductsID"`
}