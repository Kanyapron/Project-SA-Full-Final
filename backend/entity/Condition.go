package entity

import "gorm.io/gorm"

type Condition struct {
	gorm.Model
	NameCondition string

	Products []Products `gorm:"foreignKey:ConditionID"`
}