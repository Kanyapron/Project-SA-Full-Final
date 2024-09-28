package main

import (
	"Songthorsut/config"
	"Songthorsut/controller"
	"Songthorsut/controller/Member"
	"net/http"

	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {
	config.ConnectionDB()
	config.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	r.POST("/signup", Member.SignUp)
	r.POST("/signin", Member.SignIn)

	router := r.Group("/")
	{
		//Member
		router.GET("/member/:id", Member.GetMember)
		router.GET("/member", Member.ListMembers)
		router.POST("/member", Member.CreateMember)
		router.PATCH("/member/:id", Member.UpdateMember)
		router.DELETE("/member/:id", Member.DeleteMember)

		//seller
		router.GET("/seller/:id", controller.GetSeller)
		router.POST("/seller", controller.CreateSeller)
		router.PATCH("/seller/:id", controller.UpdateSeller)
		router.DELETE("/seller/:id", controller.DeleteSeller)
		router.GET("/seller/member/:member_id", controller.GetSellerByMemberId)
		router.GET("/sellers/:seller_id/member/:member_id", controller.GetSellerIdByMemberID)
		router.GET("/memberbyseller/:id", controller.GetMemberBySeller)
		router.GET("/seller/StudentID/:studentid", controller.GetSellerByStudentId)

		
		//Order
		router.POST("/orders", controller.CreateOrder)
        router.GET("/orders/:id", controller.GetOrder)
		router.PATCH("/orders/:id", controller.UpdateOrder)
        router.DELETE("/orders/:id", controller.DeleteOrder)
		router.GET("/orders/member/:memberId", controller.GetOrdersByMemberID)
		router.GET("/orders/member/:memberId/product/:productId", controller.GetOrdersByProductIDAndMemberID)
		router.GET("/orders/seller/:sellerId/product/:productId", controller.GetOrdersByProductIDAndSellerID)

		//Products
		router.GET("/products/:id", controller.GetProductsBYID)
		router.GET("/products", controller.GetProducts)
		router.POST("/products", controller.CreateProducts)
		router.DELETE("/products/:id", controller.DeleteProducts)
		router.GET("/products_by_member/:member_id", controller.GetProductsByMemberID)
		router.GET("/products/seller/:seller_id", controller.GetProductsBySellerID)
		router.GET("/products/search/:title" ,controller.GetProductsByTitle)
		router.PATCH("/products/:id", controller.UpdateProductsById)

		//Product_Order
		router.POST("/products_orders", controller.CreateProductsOrder)
		router.GET("/products_orders", controller.ListProductsOrders)
        router.DELETE("/products_orders/:id", controller.DeleteProductsOrder)
		router.GET("/products_orders/:order_id", controller.GetProductsOrdersByOrderID)

		//Select 
		router.GET("/years", controller.GetYears)
		router.GET("/instituteof", controller.GetInstituteOf)
		router.GET("/category", controller.GetCategory)
		router.GET("/condition", controller.GetCondition)
		// router.GET("/major", controller.GetMajor)

		//RoomChat
		router.GET("/roomchat/:member_id/:seller_id", controller.GetRoomChatByMemberAndSellerID)
		router.POST("/roomchat/member/:memberID/seller/:sellerID", controller.CreateRoomChat)
		router.GET("/roomchat/messages/:room_id", controller.GetMessages)
		router.GET("/roomchat/seller/:id",controller.RoomChatBySellerID)
		router.GET("/roomchat/member/:id",controller.RoomChatByMemberID)


		//Message
		router.POST("/message", controller.CreateMessage)
		router.DELETE("/messages/:id",controller.DeleteMessage)

		//Review
		router.POST("/review", controller.CreateReview)
		router.PUT("/review/:id", controller.UpdateReview)
		router.DELETE("/review/:id", controller.DeleteReview)
		router.GET("/review", controller.GetAllReview)
		router.GET("/review/seller/:seller_id", controller.GetReviewsBySellerID)//เพิ่มใหม่

	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
