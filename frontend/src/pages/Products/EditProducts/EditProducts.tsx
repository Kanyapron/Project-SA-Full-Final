

// import './EditProducts.css';
// import backarrow from "../../../assets/back-arrow.png";
// import Logo from "../../../assets/logo.png";
// import { Card, Col, Row, Input, Form, InputNumber, Select, Upload, Image, Button, message, Flex } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import type { GetProp, UploadFile, UploadProps } from 'antd';
// import { GetCategory, GetCondition, GetProductsById, UpProductsById } from '../../../services/http';
// import { CategoryInterface } from '../../../interfaces/Category';
// import { ConditionInterface } from '../../../interfaces/Condition';
// import { UploadOutlined } from '@ant-design/icons';
// import ImgCrop from 'antd-img-crop';
// import { ProductsInterface } from '../../../interfaces/Products';

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
// const { Option } = Select;

// function EditProducts() {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get product ID from URL
//   const [messageApi, contextHolder] = message.useMessage();
//   const [category, setcategory] = useState<CategoryInterface[]>([]);
//   const [condition, setcondition] = useState<ConditionInterface[]>([]);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [form] = Form.useForm();
//   const [productData, setProductData] = useState<any>(null); // State to hold product data
 

//   // Load product details for the given ID
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await GetProductsById(id);
//         if (response) {
//           setProductData(response);
//           form.setFieldsValue({
//             Title: response.Title,
//             Description: response.Description,
//             Price: response.Price,
//             CategoryID: response.CategoryID,
//             ConditionID: response.ConditionID,
//             Weight: response.Weight,
//             PictureProduct: response.PictureProduct,
//           });
//         } else {
//           throw new Error('No product data available');
//         }
//       } catch (error) {
//         console.error(error);
//         message.error(error.message || 'Failed to load product data');
//       }
//     };
//       fetchProduct();
//     }, [id, form]);

//   const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };

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

//   // Submit form and update product
//   const onFinish = async (values: ProductsInterface) => {
//     try {
//       // Call API to create a product
//       const res = await UpProductsById(id, values);  // API call to update product
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

//   // Fetch categories and conditions for select options
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

//   const handleBacktoHome = () => {
//     navigate('/MyProducts');
//   };

//   return (
//     <>
//       {contextHolder}
//       <Flex>
//         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//           <Card
//             style={{
//               marginLeft: "200px",
//               borderRadius: "12px",
//               padding: "24px",
//               background: "#e2dfdf",
//               width: "1100px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             }}>
//             <Row gutter={[16, 16]} justify="center">
//               <Col span={24} style={{ textAlign: "center" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     marginBottom: "10px",
//                     marginTop: "-80px",
//                   }}
//                 >
//                   <img
//                     src={Logo}
//                     alt="Course Logo"
//                     style={{
//                       width: "200px",
//                       marginRight: "20px",
//                       marginTop: "0",
//                     }}
//                   />
//                   <h2 style={{ margin: "0 180px" }}>แก้ไขสินค้า</h2>
//                   <img
//                     src={backarrow}
//                     alt="backarrow"
//                     onClick={handleBacktoHome}
//                     style={{
//                       width: "40px",
//                       cursor: "pointer",
//                       marginLeft: "130px",
//                     }}
//                   />
//                 </div>
//               </Col>
//             </Row>
//             <Form form={form} onFinish={onFinish}>
//               <Row gutter={[16, 16]} justify="center" 
//                 style={{ 
//                   display:"flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: "-40px", 
//                   height: "425px" }}>
//                 <Col span={12}>
//                     <Form.Item
//                       label="ชื่อสินค้า"
//                       name="Title"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <Input placeholder="ชื่อสินค้า" size="large" style={{ width: "100%" }} />
//                     </Form.Item>
                
//                     <Form.Item
//                       label="รายละเอียดของสินค้า"
//                       name="Description"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <Input.TextArea
//                         placeholder="คำอธิบาย"
//                         size="large"
//                         autoSize={{ minRows: 4, maxRows: 6 }}
//                         style={{ width: "100%" }}
//                       />
//                     </Form.Item>
                
//                     <Form.Item
//                       label="ราคาสินค้า"
//                       name="Price"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <InputNumber placeholder="ราคาสินค้า" size="large" style={{ width: "100%" }} />
//                     </Form.Item>
                
//                     <Form.Item
//                       label="หมวดหมู่สินค้า"
//                       name="CategoryID"
//                       style={{ marginBottom: "16px" }}
//                     >
//                         <Select size="large" style={{ width: "100%" }} >
//                         {category.map((item) => (
//                               <Option value={item.ID} key={item.NameCategory}>
//                                 {item.NameCategory}
//                               </Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
                          
//                     <Form.Item
//                       label="สภาพสินค้า"
//                       name="ConditionID"
//                       style={{ marginBottom: "16px" }}
//                     >
//                         <Select size="large" style={{ width: "100%" }} > 
//                         {condition.map((item) => (
//                               <Option value={item.ID} key={item.NameCondition}>
//                                 {item.NameCondition}
//                               </Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
                          
//                     <Form.Item
//                       label="น้ำหนักสินค้า"
//                       name="Weight"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <InputNumber placeholder="ไม่จำเป็นต้องระบุ" size="large" style={{ width: "100%" }} />
//                     </Form.Item>
//                 </Col>
                          
//                 <Col span={12} 
//                       style={{ 
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",     
//                         marginTop: "-10px",
//                         flexDirection: "column",
//                       }}>
//                         {/* แสดงรูปภาพสินค้า  */}
//                         {productData?.PictureProduct && (
//                           <Image
//                             src={productData.PictureProduct}
//                             alt="Product Image"
//                             style={{ width: '100%', height: 'auto', marginBottom: '16px' }}
//                           />
//                         )}
//                       <Form.Item name="PictureProduct" valuePropName="fileList">
//                         <ImgCrop rotationSlider>
//                           <Upload
//                             fileList={fileList}
//                             onChange={onChange}
//                             onPreview={onPreview}
//                             beforeUpload={(file) => {
//                               setFileList([...fileList, file]);
//                               return false;
//                             }}
//                             maxCount={5}
//                             multiple={true}
//                             listType="picture"
//                           >
//                             {fileList.length < 5 && (
//                               <Button
//                                 icon={<UploadOutlined />}
//                                 style={{ 
//                                  backgroundColor: "#212020",
//                                  borderColor: "#181818",
//                                  color: "#fff",
//                                  marginTop: "10px",
//                                 }}
//                               >
//                                 Upload
//                               </Button>
//                             )}
//                           </Upload>
//                         </ImgCrop>
//                       </Form.Item>
//                     </Col>
                          
//                 <Row justify="center">
//                     <Button
//                       type="primary"
//                       htmlType="submit"
//                       size="large"
//                       // onClick={OpenSellerHome}
//                       style={{
//                         backgroundColor: "#212020",
//                         borderColor: "#212020",
//                         borderRadius: "8px",
//                         padding: "0 60px",
//                         marginTop:"-75px",
//                         marginLeft:"750px",
//                       }}
//                     >
//                       ยืนยัน
//                     </Button>
//                   </Row>
                    
//                   <Row justify="center">
//                     <Button
//                       type="primary"
//                       htmlType="submit"
//                       size="large"
//                       // onClick={OpenSellerHome}
//                       style={{
//                         width:"160px",
//                         backgroundColor: "#ffa24c",
//                         borderColor: "#ffa24c",
//                         borderRadius: "8px",
//                         padding: "0 60px",
//                         marginTop:"-90px",
//                         marginLeft:"350px",
                      
//                       }}
//                     >
//                       ลบสินค้า
//                     </Button>
//                   </Row>
                    
//               </Row>
//             </Form>
//           </Card>
//         </div>
//       </Flex>
//   </>
  
//   );
// };

// export default EditProducts;

//Update ข้อมูลได้แล้ว ดึงข้อมูลมาโชว์ตรงที่กรอกข้อความได้แล้ว ยกเว้น รูปภาพ อัปเดตใหม่ 24/ก.ย./67 เวลา 23:30 แก้ไขรูปได้แล้ววว

import './EditProducts.css';
import backarrow from "../../../assets/back-arrow.png";
import Logo from "../../../assets/logo.png";
import { Card, Col, Row, Input, Form, InputNumber, Select, Upload, Image, Button, message, Flex } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { GetCategory, GetCondition, GetProductsById, UpProductsById } from '../../../services/http';
import { CategoryInterface } from '../../../interfaces/Category';
import { ConditionInterface } from '../../../interfaces/Condition';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { ProductsInterface } from '../../../interfaces/Products';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const { Option } = Select;

function EditProducts() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setcategory] = useState<CategoryInterface[]>([]);
  const [condition, setcondition] = useState<ConditionInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [productData, setProductData] = useState<any>(null); // State to hold product data
  const file = fileList[0]?.originFileObj;

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  // Load product details for the given ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await GetProductsById(id);
        if (response) {
          setProductData(response);
          form.setFieldsValue({
            Title: response.Title,
            Description: response.Description,
            Price: response.Price,
            CategoryID: response.CategoryID,
            ConditionID: response.ConditionID,
            Weight: response.Weight,
            PictureProduct: response.PictureProduct,
          });
        } else {
          throw new Error('No product data available');
        }
      } catch (error) {
        console.error(error);
        message.error(error.message || 'Failed to load product data');
      }
    };
      fetchProduct();
    }, [id, form]);

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

  // Submit form and update product
  const onFinish = async (values: ProductsInterface) => {
    if (id !== null) {
      values.ID = productData?.ID;
      const file = fileList[0]?.originFileObj;  // API call to update product
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          values.PictureProduct = base64data; // ใช้ base64 สำหรับเก็บรูปที่ครอบแล้ว

          const res = await UpProductsById(id, values); // ตรวจสอบ uid ก่อนที่จะส่ง
          if (res) {
            messageApi.open({
              type: "success",
              content: res.message,
            });
            setTimeout(() => {
              navigate("/MyProducts");
            }, 2000);
          } else {
            messageApi.open({
              type: "error",
              content: res.message,
            });
          }
        }
      } else {
        // ถ้าไม่มีการอัพโหลดไฟล์ใหม่
        values.PictureProduct = productData?.PictureProduct || ""; // เก็บรูปโปรไฟล์เก่าหากไม่มีการอัปโหลดใหม่
        const res = await UpProductsById(id, values);
        if (res) {
          messageApi.open({
            type: "success",
            content: res.message,
          });
          setTimeout(() => {
            navigate("/MyProducts");
          }, 2000);
        } else {
          messageApi.open({
            type: "error",
            content: res.message,
          });
        }
      }
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบ User ID",
      });
    }
  };


  // เพิ่มใหม่ 25/09  13.51 *************

  // Handle the product deletion by setting status to 'NonAvailable'
 const handleDeleteProduct = async () => {
  try {
    const values: ProductsInterface = {
      ...productData,
      Status: 'NonAvailable', // Set the status to 'NonAvailable'
    };
    const res = await UpProductsById(id, values); // Update product status via API
    if (res) {
      messageApi.open({
        type: 'success',
        content: 'สินค้าถูกลบเรียบร้อยแล้ว!',
      });
      setTimeout(() => {
        navigate('/MyProducts');
      }, 2000);
    } else {
      messageApi.open({
        type: 'error',
        content: res.message || 'เกิดข้อผิดพลาดในการลบสินค้า',
      });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    message.error('เกิดข้อผิดพลาดในการลบสินค้า');
  }
  };

  //เพิ่มใหม่ 25/09  13.51 ************* สิ้นสุด

  // Fetch categories and conditions for select options
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

  const handleBacktoHome = () => {
    navigate('/MyProducts');
  };

  return (
    <div className='body'>
      {contextHolder}
      <Flex>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" ,marginRight: 150}}>
          <Card
            style={{
              marginLeft: "200px",
              borderRadius: "12px",
              padding: "24px",
              background: "#e2dfdf",
              width: "1100px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
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
                  <h2 style={{ margin: "0 180px" }}>แก้ไขสินค้า</h2>
                  <img
                    src={backarrow}
                    alt="backarrow"
                    onClick={handleBacktoHome}
                    style={{
                      width: "40px",
                      cursor: "pointer",
                      marginLeft: "130px",
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Form form={form} onFinish={onFinish}>
              <Row gutter={[16, 16]} justify="center" 
                style={{ 
                  display:"flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "-40px", 
                  height: "425px" }}>
                <Col span={12}>
                    <Form.Item
                      label="ชื่อสินค้า"
                      name="Title"
                      style={{ marginBottom: "16px" }}
                    >
                      <Input placeholder="ชื่อสินค้า" size="large" style={{ width: "100%" }} />
                    </Form.Item>
                
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
                
                    <Form.Item
                      label="ราคาสินค้า"
                      name="Price"
                      style={{ marginBottom: "16px" }}
                    >
                      <InputNumber placeholder="ราคาสินค้า" size="large" style={{ width: "100%" }} />
                    </Form.Item>
                
                    <Form.Item
                      label="หมวดหมู่สินค้า"
                      name="CategoryID"
                      style={{ marginBottom: "16px" }}
                    >
                        <Select size="large" style={{ width: "100%" }} >
                        {category.map((item) => (
                              <Option value={item.ID} key={item.NameCategory}>
                                {item.NameCategory}
                              </Option>
                            ))}
                        </Select>
                    </Form.Item>
                          
                    <Form.Item
                      label="สภาพสินค้า"
                      name="ConditionID"
                      style={{ marginBottom: "16px" }}
                    >
                        <Select size="large" style={{ width: "100%" }} > 
                        {condition.map((item) => (
                              <Option value={item.ID} key={item.NameCondition}>
                                {item.NameCondition}
                              </Option>
                            ))}
                        </Select>
                    </Form.Item>
                          
                    <Form.Item
                      label="น้ำหนักสินค้า"
                      name="Weight"
                      style={{ marginBottom: "16px" }}
                    >
                      <InputNumber placeholder="ไม่จำเป็นต้องระบุ" size="large" style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                          
                <Col span={12} 
                      style={{ 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",     
                        marginTop: "-10px",
                        flexDirection: "column",
                      }}>
                        {/* แสดงรูปภาพสินค้า  */}
                        {productData?.PictureProduct && (
                          <Image
                            src={productData.PictureProduct}
                            alt="Product Image"
                            style={{ width: '300px', height: '300px', marginBottom: '20px' }}
                          />
                        )}
                        <Form form={form} layout="vertical" onFinish={onFinish}></Form>
                      <Form.Item name="PictureProduct" valuePropName="fileList">
                        <ImgCrop aspect={1} rotationSlider>
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
                          
                <Row justify="center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      // onClick={OpenSellerHome}
                      style={{
                        backgroundColor: "#ffa24c",
                        borderColor: "#ffa24c",
                        borderRadius: "8px",
                        padding: "0 60px",
                        marginLeft:"750px",
                      }}
                    >
                      ยืนยัน
                    </Button>
                  </Row>
                    
                  <Row justify="center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      // onClick={OpenSellerHome}
                      style={{
                        width:"160px",
                        backgroundColor: "#212020",
                        borderColor: "#212020",
                        borderRadius: "8px",
                        padding: "0 60px",
                        marginLeft:"350px",
                        marginTop:"-57px",
                      
                      }}
                      onClick={handleDeleteProduct} //เพิ่มใหม่ 25/09   13.51
                    >
                      ลบสินค้า
                    </Button>
                  </Row>
                    
              </Row>
            </Form>
          </Card>
        </div>
      </Flex>
  </div>
  
  );
};

export default EditProducts;










// //ทำเพิ่มในส่วนการลบข้อมูล  25/09/2567   04.21

// import './EditProducts.css';
// import backarrow from "../../../assets/back-arrow.png";
// import Logo from "../../../assets/logo.png";
// import { Card, Col, Row, Input, Form, InputNumber, Select, Upload, Image, Button, message, Flex } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import type { GetProp, UploadFile, UploadProps } from 'antd';
// import { GetCategory, GetCondition, GetProductsById, UpProductsById } from '../../../services/http';
// import { CategoryInterface } from '../../../interfaces/Category';
// import { ConditionInterface } from '../../../interfaces/Condition';
// import { UploadOutlined } from '@ant-design/icons';
// import ImgCrop from 'antd-img-crop';
// import { ProductsInterface } from '../../../interfaces/Products';

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
// const { Option } = Select;

// function EditProducts() {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get product ID from URL
//   const [messageApi, contextHolder] = message.useMessage();
//   const [category, setcategory] = useState<CategoryInterface[]>([]);
//   const [condition, setcondition] = useState<ConditionInterface[]>([]);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [form] = Form.useForm();
//   const [productData, setProductData] = useState<any>(null); // State to hold product data
//   const file = fileList[0]?.originFileObj;

//   const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };


//   // Load product details for the given ID
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await GetProductsById(id);
//         if (response) {
//           setProductData(response);
//           form.setFieldsValue({
//             Title: response.Title,
//             Description: response.Description,
//             Price: response.Price,
//             CategoryID: response.CategoryID,
//             ConditionID: response.ConditionID,
//             Weight: response.Weight,
//             PictureProduct: response.PictureProduct,
//           });
//         } else {
//           throw new Error('No product data available');
//         }
//       } catch (error) {
//         console.error(error);
//         message.error(error.message || 'Failed to load product data');
//       }
//     };
//       fetchProduct();
//     }, [id, form]);

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

//   // Submit form and update product
//   const onFinish = async (values: ProductsInterface) => {
//     if (id !== null) {
//       values.ID = productData?.ID;
//       const file = fileList[0]?.originFileObj;  // API call to update product
//       if (file) {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = async () => {
//           const base64data = reader.result as string;
//           values.PictureProduct = base64data; // ใช้ base64 สำหรับเก็บรูปที่ครอบแล้ว

//           const res = await UpProductsById(id, values); // ตรวจสอบ uid ก่อนที่จะส่ง
//           if (res) {
//             messageApi.open({
//               type: "success",
//               content: res.message,
//             });
//             setTimeout(() => {
//               navigate("/MyProducts");
//             }, 2000);
//           } else {
//             messageApi.open({
//               type: "error",
//               content: res.message,
//             });
//           }
//         }
//       } else {
//         // ถ้าไม่มีการอัพโหลดไฟล์ใหม่
//         values.PictureProduct = productData?.PictureProduct || ""; // เก็บรูปโปรไฟล์เก่าหากไม่มีการอัปโหลดใหม่
//         const res = await UpProductsById(id, values);
//         if (res) {
//           messageApi.open({
//             type: "success",
//             content: res.message,
//           });
//           setTimeout(() => {
//             navigate("/MyProducts");
//           }, 2000);
//         } else {
//           messageApi.open({
//             type: "error",
//             content: res.message,
//           });
//         }
//       }
//     } else {
//       messageApi.open({
//         type: "error",
//         content: "ไม่พบ User ID",
//       });
//     }
//   };
//  // Handle the product deletion by setting status to 'NonAvailable'
//  const handleDeleteProduct = async () => {
//   try {
//     const values: ProductsInterface = {
//       ...productData,
//       Status: 'NonAvailable', // Set the status to 'NonAvailable'
//     };
//     const res = await UpProductsById(id, values); // Update product status via API
//     if (res) {
//       messageApi.open({
//         type: 'success',
//         content: 'สินค้าถูกลบเรียบร้อยแล้ว!',
//       });
//       setTimeout(() => {
//         navigate('/MyProducts');
//       }, 2000);
//     } else {
//       messageApi.open({
//         type: 'error',
//         content: res.message || 'เกิดข้อผิดพลาดในการลบสินค้า',
//       });
//     }
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     message.error('เกิดข้อผิดพลาดในการลบสินค้า');
//   }
//   };

//   // Fetch categories and conditions for select options
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

//   const handleBacktoHome = () => {
//     navigate('/MyProducts');
//   };

//   return (
//     <>
//       {contextHolder}
//       <Flex>
//         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//           <Card
//             style={{
//               marginLeft: "200px",
//               borderRadius: "12px",
//               padding: "24px",
//               background: "#e2dfdf",
//               width: "1100px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             }}>
//             <Row gutter={[16, 16]} justify="center">
//               <Col span={24} style={{ textAlign: "center" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     marginBottom: "10px",
//                     marginTop: "-80px",
//                   }}
//                 >
//                   <img
//                     src={Logo}
//                     alt="Course Logo"
//                     style={{
//                       width: "200px",
//                       marginRight: "20px",
//                       marginTop: "0",
//                     }}
//                   />
//                   <h2 style={{ margin: "0 180px" }}>แก้ไขสินค้า</h2>
//                   <img
//                     src={backarrow}
//                     alt="backarrow"
//                     onClick={handleBacktoHome}
//                     style={{
//                       width: "40px",
//                       cursor: "pointer",
//                       marginLeft: "130px",
//                     }}
//                   />
//                 </div>
//               </Col>
//             </Row>
//             <Form form={form} onFinish={onFinish}>
//               <Row gutter={[16, 16]} justify="center" 
//                 style={{ 
//                   display:"flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: "-40px", 
//                   height: "425px" }}>
//                 <Col span={12}>
//                     <Form.Item
//                       label="ชื่อสินค้า"
//                       name="Title"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <Input placeholder="ชื่อสินค้า" size="large" style={{ width: "100%" }} />
//                     </Form.Item>
                
//                     <Form.Item
//                       label="รายละเอียดของสินค้า"
//                       name="Description"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <Input.TextArea
//                         placeholder="คำอธิบาย"
//                         size="large"
//                         autoSize={{ minRows: 4, maxRows: 6 }}
//                         style={{ width: "100%" }}
//                       />
//                     </Form.Item>
                
//                     <Form.Item
//                       label="ราคาสินค้า"
//                       name="Price"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <InputNumber placeholder="ราคาสินค้า" size="large" style={{ width: "100%" }} />
//                     </Form.Item>
                
//                     <Form.Item
//                       label="หมวดหมู่สินค้า"
//                       name="CategoryID"
//                       style={{ marginBottom: "16px" }}
//                     >
//                         <Select size="large" style={{ width: "100%" }} >
//                         {category.map((item) => (
//                               <Option value={item.ID} key={item.NameCategory}>
//                                 {item.NameCategory}
//                               </Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
                          
//                     <Form.Item
//                       label="สภาพสินค้า"
//                       name="ConditionID"
//                       style={{ marginBottom: "16px" }}
//                     >
//                         <Select size="large" style={{ width: "100%" }} > 
//                         {condition.map((item) => (
//                               <Option value={item.ID} key={item.NameCondition}>
//                                 {item.NameCondition}
//                               </Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
                          
//                     <Form.Item
//                       label="น้ำหนักสินค้า"
//                       name="Weight"
//                       style={{ marginBottom: "16px" }}
//                     >
//                       <InputNumber placeholder="ไม่จำเป็นต้องระบุ" size="large" style={{ width: "100%" }} />
//                     </Form.Item>
//                 </Col>
                          
//                 <Col span={12} 
//                       style={{ 
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",     
//                         marginTop: "-10px",
//                         flexDirection: "column",
//                       }}>
//                         {/* แสดงรูปภาพสินค้า  */}
//                         {productData?.PictureProduct && (
//                           <Image
//                             src={productData.PictureProduct}
//                             alt="Product Image"
//                             style={{ width: '300px', height: '300px', marginBottom: '20px' }}
//                           />
//                         )}
//                         <Form form={form} layout="vertical" onFinish={onFinish}></Form>
//                       <Form.Item name="PictureProduct" valuePropName="fileList">
//                         <ImgCrop aspect={1} rotationSlider>
//                           <Upload
//                             fileList={fileList}
//                             onChange={onChange}
//                             onPreview={onPreview}
//                             beforeUpload={(file) => {
//                               setFileList([...fileList, file]);
//                               return false;
//                             }}
//                             maxCount={5}
//                             multiple={true}
//                             listType="picture"
//                           >
//                             {fileList.length < 5 && (
//                               <Button
//                                 icon={<UploadOutlined />}
//                                 style={{ 
//                                  backgroundColor: "#212020",
//                                  borderColor: "#181818",
//                                  color: "#fff",
//                                  marginTop: "10px",
//                                 }}
//                               >
//                                 Upload
//                               </Button>
//                             )}
//                           </Upload>
//                         </ImgCrop>
//                       </Form.Item>
//                     </Col>
                          
//                 <Row justify="center">
//                     <Button
//                       type="primary"
//                       htmlType="submit"
//                       size="large"
//                       // onClick={OpenSellerHome}
//                       style={{
//                         backgroundColor: "#ffa24c",
//                         borderColor: "#ffa24c",
//                         borderRadius: "8px",
//                         padding: "0 60px",
//                         marginLeft:"750px",
//                       }}
//                     >
//                       ยืนยัน
//                     </Button>
//                   </Row>
                    
//                   <Row justify="center">
//                     <Button
//                       type="primary"
//                       htmlType="submit"
//                       size="large"
//                       // onClick={OpenSellerHome}
//                       style={{
//                         width:"160px",
//                         backgroundColor: "#212020",
//                         borderColor: "#212020",
//                         borderRadius: "8px",
//                         padding: "0 60px",
//                         marginLeft:"350px",
//                         marginTop:"-57px",
                      
//                       }}
//                       onClick={handleDeleteProduct} 
//                     >
//                       ลบสินค้า
//                     </Button>
//                   </Row>
                    
//               </Row>
//             </Form>
//           </Card>
//         </div>
//       </Flex>
//   </>
  
//   );
// };

// export default EditProducts;
