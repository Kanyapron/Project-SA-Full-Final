package entity


type RoomChat struct {
    RoomID    uint    `gorm:"primaryKey;autoIncrement"` // Primary Key
    MemberID  uint    // ผู้ซื้อ (Member) ที่เข้าร่วมในห้องแชท
    Member    Member  `gorm:"foreignKey:MemberID"`

    SellerID  uint    // ผู้ขายที่เข้าร่วมในห้องแชท
    Seller    Seller  `gorm:"foreignKey:SellerID"`

    // ความสัมพันธ์ one-to-many กับ Message
    Messages  []Message `gorm:"foreignKey:RoomChatID"`
}