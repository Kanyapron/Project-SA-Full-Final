package entity

import (
	"gorm.io/gorm"
)

type Order struct {
   gorm.Model
   Quantity    uint
   Total_price float32

   MemberID *uint
   Member   Member `gorm:"foreignKey:MemberID"`

   SellerID *uint
   Seller   Seller `gorm:"foreignKey:SellerID"`
   
   Product_Orders []Products_order `gorm:"foreignKey:OrderID"`
}
