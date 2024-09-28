package entity

import (
	"gorm.io/gorm"
)

type Products_order struct {
   gorm.Model
   ProductID *uint
   Product   Products `gorm:"foreignKey:ProductID"`

   OrderID *uint
   Order   Order `gorm:"foreignKey:OrderID"`
}

