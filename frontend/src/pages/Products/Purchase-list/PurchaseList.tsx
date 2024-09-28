import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { DeleteOrder, GetOrdersByProductIDAndSellerID, GetProductsBySellerId, GetMemberById, GetSellerByMemberId } from "../../../services/http/index";
import "./PurchaseList.css";
import { SellerInterface } from "../../../interfaces/Seller";
import Navbarproducts from "../../../component/navbarProducts.tsx";
interface Product{
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
}
interface Order {
  ID: number;
  Quantity: number;
  Total_price: number;
  SellerID: number;
  MemberID: number;
}

interface MemberByOrder {
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
}

const Index: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const MemberID = Number(localStorage.getItem("id"));
  const [sellerID, setSellerId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const fetchSellerData = async () => {
    try {
      const sellerData = await GetSellerByMemberId(MemberID);
      console.log("Seller data from API: ", sellerData);
      setSeller(sellerData.seller);
      setSellerId(sellerData.seller_id);
    } catch (error) {
      console.error("Error fetching seller data:", error);
    }
  };
  const fetchProducts = async (page: number = 1, pageSize: number = 10) => {
    setProducts([]);
    if (!seller) return;
    try {
      const result = await GetProductsBySellerId(sellerID, page, pageSize);
      if (result && Array.isArray(result.products)) {
        const updatedProducts: Product[] = [];
        const uniqueProductOrderIds = new Set<number>();

        for (const product of result.products) {
          const orders: Order[] = await GetOrdersByProductIDAndSellerID(sellerID , product.ID);
          if (orders && orders.length > 0) {
            for (const order of orders) {
              if (!uniqueProductOrderIds.has(order.ID)) {
                uniqueProductOrderIds.add(order.ID);
                const memberDatabyoeder: MemberByOrder | undefined = await GetMemberById(order.MemberID);
                console.log("membr data " + memberDatabyoeder);
                console.log("Member ID: ", order.MemberID);
                console.log("Member Data: ", memberDatabyoeder);
                updatedProducts.push({
                  ...product,
                  Price: order.Total_price,
                  OrderID: order.ID,
                  Quantity: order.Quantity,
                  FirstName: memberDatabyoeder.data.FirstName,
                  LastName: memberDatabyoeder.data.LastName,
                  PhoneNumber: memberDatabyoeder.data.PhoneNumber,
                });console.log("Updated Products: ", updatedProducts);
              }
            }
          }
        }

        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  useEffect(() => {
    if (seller) {
      fetchProducts();
    }
  }, [seller]);

  const columns: ColumnsType<Product> = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "title",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "price",
      render: (price) => `฿${price}`,
    },
    {
      title: "Name",
      key: "memberName",
      render: (_, record) => `${record.FirstName || ""} ${record.LastName || ""}`,
    },
    {
      title: "PhoneNumber",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Picture",
      dataIndex: "PictureProduct",
      key: "PictureProduct",
      render: (_, record) => (
        <img src={record.PictureProduct} alt={record.Title} width="170" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => showModal(record)}
          style={{ marginLeft: 10 }}
          shape="circle"
          icon={<DeleteOutlined />}
          size="large"
          danger
        />
      ),
    },
  ];

  const showModal = (product: ProductByOrder) => {
    setModalText(`คุณต้องการลบข้อมูลคำสั่งซื้อสำหรับสินค้าชื่อ "${product.Title}" หรือไม่?`);
    setDeleteId(product.OrderID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await DeleteOrder(deleteId!);
      setOpen(false);
      setConfirmLoading(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลคำสั่งซื้อสำเร็จ",
      });
      fetchProducts();
    } catch (error) {
      setConfirmLoading(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบคำสั่งซื้อ",
      });
    }
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className="card">
      {contextHolder}
      <Navbarproducts/>
      <h1>รายการคำสั่งซื้อ</h1>
      <Table
        rowKey="ID"
        columns={columns}
        dataSource={products}
        className="columns"
        pagination={{
          pageSize: 2,
          onChange: (page, pageSize) => fetchProducts(page, pageSize),
        }}
      />
      <Modal
        title="ลบข้อมูลคำสั่งซื้อ?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
};

export default Index;
