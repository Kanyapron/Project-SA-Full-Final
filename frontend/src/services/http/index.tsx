
import { LoginInterface } from "../../interfaces/Login";
import { MemberInterface } from "../../interfaces/Member";
import { ProductsInterface } from "../../interfaces/Products";
import { Products_Orders } from "../../interfaces/Products_orders";
import { SellerInterface } from "../../interfaces/Seller";
import { MessageInterface } from "../../interfaces/IMessage";
import axios from "axios";


const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");


const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};

//Member

async function Login(data: LoginInterface) {

  return await axios

    .post(`${apiUrl}/signin`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// async function ApplySeller(data: SellerInterface) {

//   return await axios

//     .post(`${apiUrl}/seller`, data, requestOptions)

//     .then((res) => res)

//     .catch((e) => e.response);

// }


async function GetMember(member_id:Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/member/${member_id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
} 


async function GetMemberById(id: number) {

  return await axios

    .get(`${apiUrl}/member/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function UpdateMemberById(id: number, data: MemberInterface) {

  return await axios

    .patch(`${apiUrl}/member/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function DeleteMemberById(id: string) {

  return await axios

    .delete(`${apiUrl}/member/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function CreateMember(data: MemberInterface) {

  return await axios

    .post(`${apiUrl}/signup`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetMemberByEmail(email: string) {
  return await axios
    .get(`${apiUrl}/member/email/${email}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


// Order Management

// List all orders
async function GetOrders() {
  try {
    const res = await axios.get(`${apiUrl}/orders`);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    return false;
  }
}

// Get an order by ID
async function GetOrderById(id: number | undefined) {
  try {
    const res = await axios.get(`${apiUrl}/orders/${id}`);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    return false;
  }
}

// Create a new order
async function CreateOrder(data: Orders) {
  try {
    const res = await axios.post(`${apiUrl}/orders`, data);
    return res.status === 201 ? res.data : false;
  } catch (error) {
    return false;
  }
}



// Delete an order by ID
async function DeleteOrder(id: number | undefined) {
  try {
    const res = await axios.delete(`${apiUrl}/orders/${id}`);
    return res.status === 200;
  } catch (error) {
    return false;
  }
}




//Seller


// async function GetSeller() {
//   const seller = localStorage.getItem('seller_id');
//   if (!seller) {
//     throw new Error('Seller not found in localStorage');
//   }

//   return await GetSellerByStudentId(seller);
// }



async function GetSellerByStudentId(StudentID: string) {
  return await axios
    .get(`${apiUrl}/seller/StudentID/${StudentID}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


async function GetSeller(id: number) {

  return await axios

    .get(`${apiUrl}/seller/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}





async function UpdateSellerById(id: number, data: SellerInterface) {

  return await axios

    .patch(`${apiUrl}/seller/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function DeleteSellerById(id: number) {

  return await axios

    .delete(`${apiUrl}/seller/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function CreateSeller(data: SellerInterface) {

  return await axios

    .post(`${apiUrl}/seller`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// // ห้ามแก้ไข!!!!!!
// async function GetSellerByMember(member_id: number) {
//   return await axios
//     .get(`${apiUrl}/seller/member/${member_id}`, requestOptions) // ตรวจสอบ URL นี้ว่าเป็น endpoint ที่ถูกต้อง
//     .then((res) => res)
//     .catch((e) => e.response);
// }

// ทดสอบเฉยๆ ลบได้ แก้ไขได้
async function GetSellerByMemberId(member_id: number) {
  try {
    const res = await axios.get(`${apiUrl}/seller/member/${member_id}`, requestOptions); // Fetch seller by member_id
    if (res.status === 200) {
      return res.data; // Return the seller data from the response
    } else {
      return { error: res.data?.error || "Failed to fetch seller information." };
    }
  } catch (error) {
    return { error: "An error occurred while fetching seller information." };
  }
}



async function GetSellerIdByMemberId(seller_id: number, member_id: number) {
  return await axios
    .get(`${apiUrl}/seller/${seller_id}/member/${member_id}`, requestOptions) // ตรวจสอบ URL นี้ว่าเป็น endpoint ที่ถูกต้อง
    .then((res) => res)
    .catch((e) => e.response);
}


// ทำงานได้แล้วห้ามแก้ไข!!!!!!!!!!!!!!!!!!!!!!!

// async function GetSellerIdByMemberId(seller_id: number, member_id: number) {
//   try {
//     // แก้ไข URL ให้ตรงตามที่ต้องการ
//     const response = await axios.get(`${apiUrl}/sellers/${seller_id}/member/${member_id}`, requestOptions);
    
//     // สมมติว่า seller_id และ member_id อยู่ใน response.data
//     const sellerData = response.data;

//     // ส่งกลับ seller_id และ member_id จาก response
//     return { seller_id: sellerData.seller_id, member_id: sellerData.member_id, seller: sellerData.seller };
//   } catch (error) {
//     return error.response;
//   }
// }




//Products
  async function GetProducts() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/products`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }


  async function DeleteProductsByID(id: number | undefined) {
    const requestOptions = {
      method: "DELETE"
    };
  
    let res = await fetch(`${apiUrl}/products/${id}`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return true;
        } else {
          return false;
        }
      });
  
    return res;
  }
  
  async function CreateProducts(data: ProductsInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/products`, requestOptions)
      .then((res) => {
        if (res.status == 201) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }
  
  async function UpdateProducts(data: ProductsInterface) {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/products`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }


  // Products Order Management

// List all products-orders
async function GetProductsOrders() {
  try {
    const res = await axios.get(`${apiUrl}/products_orders`);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    return false;
  }
}

// Get a products-order by ID
async function GetProductsOrderById(id: number | undefined) {
  try {
    const res = await axios.get(`${apiUrl}/products_orders/${id}`);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    return false;
  }
}


async function GetProductsById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
  };

  try {
    let res = await fetch(`${apiUrl}/products/${id}`, requestOptions);
    
    if (!res.ok) {
      const errorData = await res.json(); // รับข้อมูลข้อผิดพลาด
      throw new Error(errorData.message || 'Failed to fetch product');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null; // คืนค่า null ถ้ามีข้อผิดพลาด
  }
}

// Create a new products-order
async function CreateProductsOrder(data: Products_Orders) {
  try {
    const res = await axios.post(`${apiUrl}/products_orders`, data);
    return res.status === 201 ? res.data : false;
  } catch (error) {
    return false;
  }
}

// Update a products-order by ID
async function UpdateProductsOrder(id: number | undefined, data: Products_Orders) {
  try {
    const res = await axios.patch(`${apiUrl}/products_orders/${id}`, data);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    return false;
  }
}

// Delete a products-order by ID
async function DeleteProductsOrder(id: number | undefined) {
  try {
    const res = await axios.delete(`${apiUrl}/products_orders/${id}`);
    return res.status === 200;
  } catch (error) {
    return false;
  }
}


async function GetOrdersByMemberId(memberId: number) {
  try {
    const res = await axios.get(`${apiUrl}/orders?member_id=${memberId}`);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    return false;
  }
}

// Get all products-orders for a member
async function GetProductsByMemberId(memberId: number, page: number, pageSize: number) {
  try {
    const res = await axios.get(`${apiUrl}/products_by_member/${memberId}`, {
      params: {
        page: page,
        pageSize: pageSize,
      },
    });
    return res.status === 200 ? res.data : false;
  } catch (error) {
    return false;
  }
}

async function GetProductsBySellerId(sellerId: number, page: number, pageSize: number) {
  try {
    const res = await axios.get(`${apiUrl}/products/seller/${sellerId}`, {
      params: {
        page: page,
        pageSize: pageSize,
      },
    });
    return res.status === 200 ? res.data : false;
  } catch (error) {
    console.error("Error fetching products by seller ID:", error);
    return false;
  }
}



async function GetOrdersByProductIDAndMemberID(memberId: number, productId: number) {
  try {
    const res = await axios.get(`${apiUrl}/orders/member/${memberId}/product/${productId}`);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    console.error("Error fetching orders by Product ID and Member ID:", error);
    return false;
  }
}

async function GetOrdersByProductIDAndSellerID(sellerId: number, productId: number) {
  try {
    const res = await axios.get(`${apiUrl}/orders/seller/${sellerId}/product/${productId}`);
    return res.status === 200 ? res.data : false;
  } catch (error) {
    console.error("Error fetching orders by Product ID and Seller ID:", error);
    return false;
  }
}

//Select
  async function GetYear() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/years`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }

  async function GetInstituteOf() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/instituteof`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }

  async function GetCategory() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/category`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }

  async function GetCondition() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/condition`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }

  
  async function CreateRoomChat(memberID: number, sellerID: number): Promise<any> {
    const apiUrlWithParams = `${apiUrl}/roomchat/member/${memberID}/seller/${sellerID}`;
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ MemberID: memberID, SellerID: sellerID }), // ส่งข้อมูลที่จำเป็นใน body
    };

    try {
        const res = await fetch(apiUrlWithParams, requestOptions);
        if (res.ok) { // ตรวจสอบว่าตอบกลับเป็น 2xx
            return res.json();
        } else {
            const errorData = await res.json(); // รับข้อมูลข้อผิดพลาด
            console.error("Error:", errorData);
            return { message: errorData.error || "An error occurred" }; // ส่งคืนข้อความผิดพลาด
        }
    } catch (error) {
        console.error("Network error:", error);
        return { message: "Network error occurred" }; // ส่งคืนข้อความเมื่อเกิดข้อผิดพลาดในเครือข่าย
    }
  }
  
  async function GetMessage(id:Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/roomchat/messages/${id}`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }  

  async function GetRoomChat() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/roomchat`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }  

  async function CreateMessage(messageData: MessageInterface) {
    try {
      // แปลงคีย์ของ messageData
      const formattedData = {
        room_chat_id: messageData.room_chat_id,
        content: messageData.content,
        picture_content: messageData.picture_content, //-----------------------เพิ่มรูป---------------------------
        sender_id: messageData.sender_id,
      };
  
      const response = await fetch(`${apiUrl}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error(`Error: ${response.statusText}`);
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred");
      }
      return false;
    }
  }
  
  async function GetMemberBySeller(seller_id: number | undefined) {
    if (seller_id === undefined) {
      console.error("Seller ID is undefined");
      return false;
    }
  
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    try {
      const response = await fetch(`${apiUrl}/memberbyseller/${seller_id}`, requestOptions);
  
      // ตรวจสอบว่าการตอบสนองถูกต้องหรือไม่
      if (!response.ok) {
        console.error("Error fetching member by seller:", response.statusText);
        return false;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  }

  async function RoomChatBySellerID(sellerID: number): Promise<any> {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(`${apiUrl}/roomchat/seller/${sellerID}`, requestOptions);

    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return false;
    }
  }

    async function RoomChatByMemberID(memberID: number): Promise<any> {
      const requestOptions = {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      };
  
      const response = await fetch(`${apiUrl}/roomchat/member/${memberID}`, requestOptions);
  
      if (response.ok) {
          return await response.json();
      } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          return false;
      }
    }


    async function GetRoomChatByMemberAndSellerID(memberID: number, sellerID: number): Promise<any> {
      const requestOptions = {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      };
  
      // ปรับ URL ให้ถูกต้อง
      const response = await fetch(`${apiUrl}/roomchat/${memberID}/${sellerID}`, requestOptions);
  
      if (response.ok) {
          return await response.json();
      } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          return false;
      }
  }

  async function GetProductsByTitle(title: string) {
    try {
      const res = await axios.get(`${apiUrl}/products/search/${title}`);
      if (res.status === 200) {
        return res.data.products as ProductsInterface[]; // แปลงข้อมูล response ให้เป็น array ของสินค้า
      } else {
        console.error(`Error fetching products: ${res.statusText}`);
        return false;
      }
    } catch (error) {
      console.error("Error fetching products by title:", error);
      return false;
    }
  }

  async function UpProductsById(id: number , data: ProductsInterface) {

    return await axios
  
    .patch(`${apiUrl}/products/${id}`, data, requestOptions)
  
      .then((res) => res)
  
      .catch((e) => e.response);
  
  }


  


export {
  //Member
  Login,
  GetMember,
  CreateMember,
  DeleteMemberById,
  GetMemberById,
  UpdateMemberById,
  GetMemberByEmail,
  GetOrdersByMemberId,

  // ApplySeller,

  //Orsers
  GetOrders,
  GetOrderById,
  CreateOrder,
  DeleteOrder,

  //Seller
  GetSeller,
  CreateSeller,
  DeleteSellerById,
  UpdateSellerById,
  // GetSellerByMember,
  GetSellerByMemberId,
  GetSellerByStudentId,
  GetSellerIdByMemberId,

  //Products
  GetProducts,
  CreateProducts,
  DeleteProductsByID,
  GetProductsById,
  UpdateProducts,
  GetProductsByTitle,
  UpProductsById,

  GetProductsByMemberId,
  GetProductsBySellerId,
  GetOrdersByProductIDAndMemberID,
  GetOrdersByProductIDAndSellerID,

  //ProductsOrders
  GetProductsOrders,
  GetProductsOrderById,
  CreateProductsOrder,
  UpdateProductsOrder,
  DeleteProductsOrder,



  //Select ขอแต่ละหน้า
  GetYear,
  GetInstituteOf,
  GetCategory,
  GetCondition,

  //Roomchat
    GetRoomChatByMemberAndSellerID,
    RoomChatByMemberID,
    RoomChatBySellerID,
    CreateRoomChat,
    GetRoomChat,
    GetMemberBySeller,
  //Message
    CreateMessage,
    GetMessage
};


