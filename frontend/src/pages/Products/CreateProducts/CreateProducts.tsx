// import './CreateProducts.css';
// import backarrow from "../../../assets/back-arrow.png";
// import Logo from "../../../assets/logo.png";
// import { Card, Col, Row, Input, Form, InputNumber, Upload, Image, Button, message, Select, Flex } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import type { UploadFile, UploadProps } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import ImgCrop from 'antd-img-crop';
// import { ProductsInterface } from '../../../interfaces/Products';
// import { CreateProducts, GetCategory, GetCondition, GetSeller, GetSellerByMember, GetSellerIdByMember, GetSellerIdByMemberId} from '../../../services/http';
// import { CategoryInterface } from '../../../interfaces/Category';
// import { ConditionInterface } from '../../../interfaces/Condition';
// import { SellerInterface } from '../../../interfaces/Seller';
// import { MemberInterface } from '../../../interfaces/Member';
// import axios from 'axios';

// // Type definition for image file type
// type FileType = File & { originFileObj?: File };

// const { Option } = Select;


// // Main CreateProduct component
// function CreateProduct() {
//   const navigate = useNavigate();
//   const [messageApi, contextHolder] = message.useMessage();
//   const [category, setcategory] = useState<CategoryInterface[]>([]);
//   const [condition, setcondition] = useState<ConditionInterface[]>([]);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);


//    //ส่วนที่เพิ่มสำหรับเซ็ตค่า Seller************************************************************************
//    const [mid, setMid] = useState<number | null>(Number(localStorage.getItem("id")));
//    const [member, setMember] = useState<MemberInterface | null>(null);
 
//    const GetSellerByMemberID = async (member_id: number) => {
//      let res = await GetSellerByMember(member_id); // Use the GetSellerByMember function
//      if (res.status === 200) {
//        setMember(res.data); // Set the fetched member data
//      } else {
//        messageApi.open({
//          type: "error",
//          content: res.data?.error || "Failed to fetch member information.",
//        });
//      }
//    };
 
//    useEffect(() => {
//      const storedId = Number(localStorage.getItem("id"));
//      setMid(storedId); // Set mid from localStorage
 
//      if (storedId) {
//        console.log(storedId); // Log the correct value for debugging
//        GetSellerByMemberID(storedId); // Fetch seller by member ID
//      }
//    }, []);
//    //ส่วนที่เพิ่ม************************************************************************




//   // Handle file changes
//   const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };

//   // Preview image in a new tab
//   const onPreview = async (file: UploadFile) => {
//     let src = file.url as string;
//     if (!src) {
//       src = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file.originFileObj as FileType);
//         reader.onload = () => resolve(reader.result as string);
//       });
//     }
//     const image = new Image();
//     image.src = src;
//     const imgWindow = window.open(src);
//     imgWindow?.document.write(image.outerHTML);
//   };

//   // Handle form submission
//   const onFinish = async (values: ProductsInterface) => {
//     if (!fileList.length || !fileList[0]?.thumbUrl) {
//       messageApi.open({
//         type: "error",
//         content: "กรุณาอัปโหลดรูปสินค้า!",
//       });
//       return;
//     }

//     // Attach the image to the product values
//     values.PictureProduct = fileList[0].thumbUrl;
//     values.Status = "Available"; // Set Status to "Available"

//     try {
//       // Call API to create a product
//       const res = await CreateProducts(values);
//       if (res) {
//         messageApi.open({
//           type: "success",
//           content: "บันทึกข้อมูลสำเร็จ",
//         });
//         setTimeout(() => navigate("/MyProducts"), 2000);
//       } else {
//         throw new Error("Error saving product.");
//       }
//     } catch (error) {
//       console.error(error);
//       messageApi.open({
//         type: "error",
//         content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล!",
//       });
//     }
//   };

//   const getcategory = async () => {
//     let res = await GetCategory();
//     if (res) {
//       setcategory(res);
//     }
//   };

//   useEffect(() => {
//     getcategory();
//   }, []);

//   const getcondition = async () => {
//     let res = await GetCondition();
//     if (res) {
//       setcondition(res);
//     }
//   };

//   useEffect(() => {
//     getcondition();
//   }, []);

//   // Go back to the home page
//   const handleBacktoHomeSeller = () => {
//     navigate('/HomeSeller'); 
//   };

//   return (
//     <div>
//     <Flex>
//       {contextHolder}
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//         <Card
//           style={{
//             marginLeft:"200px",
//             borderRadius: "12px",
//             padding: "24px",
//             background: "#e2dfdf",
//             width: "1100px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Row gutter={[16, 16]} justify="center">
//             <Col span={24} style={{ textAlign: "center" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginBottom: "10px",
//                   marginTop: "-80px",
//                 }}
//               >
//                 <img
//                   src={Logo}
//                   alt="Course Logo"
//                   style={{
//                     width: "200px",
//                     marginRight: "20px",
//                     marginTop: "0",
//                   }}
//                 />
//                 <h2 style={{ margin: "0 180px" }}>สร้างการขายสินค้า</h2>
//                 <img
//                   src={backarrow}
//                   alt="backarrow"
//                   onClick={handleBacktoHomeSeller}
//                   style={{
//                     width: "40px",
//                     cursor: "pointer",
//                     marginLeft: "130px",
//                   }}
//                 />
//               </div>
//             </Col>
//           </Row>

//           <Form onFinish={onFinish}>
//             <Row gutter={[16, 16]} justify="center" style={{ marginTop: "-40px", height: "425px" }}>
//               <Col span={12}>
//                 {/* Product Name */}
//                 <Form.Item
//                   label="ชื่อสินค้า"
//                   name="Title"
//                   rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า!" }]}
//                   style={{ marginBottom: "16px" }}
//                 >
//                   <Input placeholder="ชื่อสินค้า" size="large" style={{ width: "100%" }} />
//                 </Form.Item>

//                 {/* Product Description */}
//                 <Form.Item
//                   label="รายละเอียดของสินค้า"
//                   name="Description"
//                   style={{ marginBottom: "16px" }}
//                 >
//                   <Input.TextArea
//                     placeholder="คำอธิบาย"
//                     size="large"
//                     autoSize={{ minRows: 4, maxRows: 6 }}
//                     style={{ width: "100%" }}
//                   />
//                 </Form.Item>

//                 {/* Product Price */}
//                 <Form.Item
//                   label="ราคาสินค้า"
//                   name="Price"
//                   rules={[{ required: true, message: "กรุณากรอกราคาสินค้า!" }]}
//                   style={{ marginBottom: "16px" }}
//                 >
//                   <InputNumber placeholder="ราคาสินค้า" size="large" style={{ width: "100%" }} />
//                 </Form.Item>

//                 {/* Product Category */}
//                 <Form.Item
//                   label="หมวดหมู่สินค้า"
//                   name="Category"
//                   rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่สินค้า!" }]}
//                   style={{ marginBottom: "16px" }}
//                 >
//                   <Select size="large" style={{ width: "100%" }} >
//                   {category.map((item) => (
//                         <Option value={item.ID} key={item.NameCategory}>
//                           {item.NameCategory}
//                         </Option>
//                       ))}
//                   </Select>
//                 </Form.Item>

//                 {/* Product Condition */}
//                 <Form.Item
//                   label="สภาพสินค้า"
//                   name="Condition"
//                   rules={[{ required: true, message: "กรุณาเลือกสภาพสินค้า!" }]}
//                   style={{ marginBottom: "16px" }}
//                 >
//                   <Select size="large" style={{ width: "100%" }} > 
//                     {condition.map((item) => (
//                       <Option value={item.ID} key={item.NameCondition}>
//                         {item.NameCondition}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 {/* Product Weight */}
//                 <Form.Item
//                   label="น้ำหนักสินค้า"
//                   name="Weight"
//                   style={{ marginBottom: "16px" }}
//                 >
//                   <InputNumber placeholder="ไม่จำเป็นต้องระบุ" size="large" style={{ width: "100%" }} />
//                 </Form.Item>
//               </Col>

//               {/* Image Upload */}
//               <Col span={12} 
//                   style={{ 
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",     
//                     marginTop: "-10px",
//                     flexDirection: "column",
//                     }}>
//                 <Form.Item name="Picture_product" valuePropName="fileList">
//                   <ImgCrop rotationSlider>
//                     <Upload
//                       fileList={fileList}
//                       onChange={onChange}
//                       onPreview={onPreview}
//                       beforeUpload={(file) => {
//                         setFileList([...fileList, file]);
//                         return false;
//                       }}
//                       maxCount={5}
//                       multiple={true}
//                       listType="picture"
//                     >
//                       {fileList.length < 5 && (
//                         <Button
//                           type="primary"
//                           icon={<UploadOutlined />}
//                           style={{ 
//                            backgroundColor: "#212020",
//                            borderColor: "#181818",
//                            color: "#fff",
//                            marginTop: "10px",
//                           }}
//                         >
//                           Upload
//                         </Button>
//                       )}
//                     </Upload>
//                   </ImgCrop>
//                 </Form.Item>
//               </Col>

//               {/* Submit Button */}
//               <Row justify="center">
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   size="large"
//                   style={{
//                     backgroundColor: "#ffa24c",
//                     borderColor: "#ffa24c",
//                     borderRadius: "8px",
//                     padding: "0 60px",
//                     marginTop:"-35px",
//                     marginLeft:"520px",
//                   }}
//                 >
//                   ยืนยัน
//                 </Button>
//               </Row>
//             </Row>
//           </Form>
//         </Card>
//       </div>
//     </Flex>
//     </div>
//   );
// }

// export default CreateProduct;












import './CreateProducts.css';
import backarrow from "../../../assets/back-arrow.png";
import Logo from "../../../assets/logo.png";
import { Card, Col, Row, Input, Form, InputNumber, Upload, Image, Button, message, Select, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { ProductsInterface } from '../../../interfaces/Products';
import { CreateProducts, GetCategory, GetCondition, GetSellerByMemberId } from '../../../services/http';
import { CategoryInterface } from '../../../interfaces/Category';
import { ConditionInterface } from '../../../interfaces/Condition';
import { SellerInterface } from '../../../interfaces/Seller';

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Option } = Select;

function CreateProduct() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setcategory] = useState<CategoryInterface[]>([]);
  const [condition, setcondition] = useState<ConditionInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Seller state
  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [sellerId, setSellerId] = useState<number | null>(null);

  // Function to fetch seller by member_id
  const fetchSeller = async (member_id: number) => {
    const res = await GetSellerByMemberId(member_id); // Call the function
    if (!res.error) {
      setSeller(res.seller); // Set the seller object
      setSellerId(res.seller_id); // Set the seller ID
    } else {
      message.error(res.error); // Display error message if any
    }
  };


  // Fetch the seller when the component mounts or the member_id changes
  useEffect(() => {
    const memberId = Number(localStorage.getItem("id")); // Assuming member_id is stored in localStorage
    if (memberId) {
      fetchSeller(memberId); // Fetch seller using the member ID
    }
  }, []);

  // Handle file changes
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // Handle form submission
  const onFinish = async (values: ProductsInterface) => {

    const res = await CreateProducts(values);
    console.log("API response:", res); // Log the API response to see what went wrong
    
    if (!sellerId) {
      message.error("Seller ID is missing. Unable to create product.");
      return;
    }
  
    if (!fileList.length || !fileList[0]?.thumbUrl) {
      messageApi.open({
        type: "error",
        content: "กรุณาอัปโหลดรูปสินค้า!",
      });
      return;
    }
  
  
    // Attach the image to the product values
    values.PictureProduct = fileList[0].thumbUrl;
    values.SellerId = sellerId;
    values.Status = "Available"; // Set Status to "Available"
    console.log("Seller ID:", values.SellerId); // Log the seller ID
    console.log("Form values:", values);
    try {
      // Call API to create a product
      const res = await CreateProducts(values);
      if (res) {
        messageApi.open({
          type: "success",
          content: "บันทึกข้อมูลสำเร็จ",
        });
        setTimeout(() => navigate("/MyProducts"), 2000);
      } else {
        throw new Error("Error saving product.");
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล!",
      });
    }
  };
  
  

  const getcategory = async () => {
    let res = await GetCategory();
    if (res) {
      setcategory(res);
    }
  };

  useEffect(() => {
    getcategory();
  }, []);

  const getcondition = async () => {
    let res = await GetCondition();
    if (res) {
      setcondition(res);
    }
  };

  useEffect(() => {
    getcondition();
  }, []);

  // Go back to the home page
  const handleBacktoHomeSeller = () => {
    navigate('/HomeSeller'); 
  };

  return (
    <div>
    <Flex>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Card
          style={{
            marginLeft:"200px",
            borderRadius: "12px",
            padding: "24px",
            background: "#e2dfdf",
            width: "1100px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col span={24} style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                  marginTop: "-80px",
                }}
              >
                <img
                  src={Logo}
                  alt="Course Logo"
                  style={{
                    width: "200px",
                    marginRight: "20px",
                    marginTop: "0",
                  }}
                />
                <h2 style={{ margin: "0 180px" }}>สร้างการขายสินค้า</h2>
                <img
                  src={backarrow}
                  alt="backarrow"
                  onClick={handleBacktoHomeSeller}
                  style={{
                    width: "40px",
                    cursor: "pointer",
                    marginLeft: "130px",
                  }}
                />
              </div>
            </Col>
          </Row>

          <Form onFinish={onFinish}>
            <Row gutter={[16, 16]} justify="center" style={{ marginTop: "-40px", height: "425px" }}>
              <Col span={12}>
                {/* Product Name */}
                <Form.Item
                  label="ชื่อสินค้า"
                  name="Title"
                  rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า!" }]}
                  style={{ marginBottom: "16px" }}
                >
                  <Input placeholder="ชื่อสินค้า" size="large" style={{ width: "100%" }} />
                </Form.Item>

                {/* Product Description */}
                <Form.Item
                  label="รายละเอียดของสินค้า"
                  name="Description"
                  style={{ marginBottom: "16px" }}
                >
                  <Input.TextArea
                    placeholder="คำอธิบาย"
                    size="large"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                {/* Product Price */}
                <Form.Item
                  label="ราคาสินค้า"
                  name="Price"
                  rules={[{ required: true, message: "กรุณากรอกราคาสินค้า!" }]}
                  style={{ marginBottom: "16px" }}
                >
                  <InputNumber placeholder="ราคาสินค้า" size="large" style={{ width: "100%" }} />
                </Form.Item>

                {/* Product Category */}
                <Form.Item
                  label="หมวดหมู่สินค้า"
                  name="CategoryID"
                  rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่สินค้า!" }]}
                  style={{ marginBottom: "16px" }}
                >
                  <Select size="large" style={{ width: "100%" }}>
                    {category.map((item) => (
                      <Option value={item.ID} key={item.NameCategory}>
                        {item.NameCategory}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Product Condition */}
                <Form.Item
                  label="สภาพสินค้า"
                  name="ConditionID"
                  rules={[{ required: true, message: "กรุณาเลือกสภาพสินค้า!" }]}
                  style={{ marginBottom: "16px" }}
                >
                  <Select size="large" style={{ width: "100%" }}>
                    {condition.map((item) => (
                      <Option value={item.ID} key={item.NameCondition}>
                        {item.NameCondition}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Product Weight */}
                <Form.Item
                  label="น้ำหนักสินค้า"
                  name="Weight"
                  style={{ marginBottom: "16px" }}
                >
                  <InputNumber placeholder="ไม่จำเป็นต้องระบุ" size="large" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Image Upload */}
              <Col span={12} 
                style={{ 
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",     
                  marginTop: "-10px",
                  flexDirection: "column",
                }}>
                <Form.Item name="PictureProduct" valuePropName="fileList">
                  <ImgCrop rotationSlider>
                    <Upload
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={(file) => {
                        setFileList([...fileList, file]);
                        return false;
                      }}
                      maxCount={5}
                      multiple={true}
                      listType="picture"
                    >
                      {fileList.length < 5 && (
                        <Button
                          type="primary"
                          icon={<UploadOutlined />}
                          style={{ 
                           backgroundColor: "#212020",
                           borderColor: "#181818",
                           color: "#fff",
                           marginTop: "10px",
                          }}
                        >
                          Upload
                        </Button>
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </Col>

              {/* Submit Button */}
              <Row justify="center">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    backgroundColor: "#ffa24c",
                    borderColor: "#ffa24c",
                    borderRadius: "8px",
                    padding: "0 60px",
                    marginTop: "-35px",
                    marginLeft: "520px",
                  }}
                >
                  ยืนยัน
                </Button>
              </Row>
            </Row>
          </Form>
        </Card>
      </div>
    </Flex>
    </div>
  );
}

export default CreateProduct;
