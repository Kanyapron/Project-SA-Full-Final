// เช็คว่ารหัส นศ ควรมี 8 ตัว และเช็ครหัสที่เคยสมัครได้แล้ว เช็คทั้งตัวใหญ่และตัวเล็กได้แล้ว ห้ามแก้ไข !!!!!!!!!!!!!!!!!!!!!!

import React, { useEffect, useState } from "react";
import backarrow from "../../../assets/back-arrow.png";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import "./ApplyToSeller.css";
import {
  Button,
  Form,
  Row,
  Col,
  Input,
  Select,
  Card,
  Flex,
  message,
  Upload,
  GetProp,
  UploadProps,
  UploadFile,
} from "antd";
import { YearsInterface } from "../../../interfaces/Years";
import {
  CreateSeller,
  GetInstituteOf,
  GetMemberById,
  GetSellerByStudentId,
  GetYear,
} from "../../../services/http/index";
import { SellerInterface } from "../../../interfaces/Seller";
import { InstituteOfInterface } from "../../../interfaces/InstituteOf";
import { UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { MemberInterface } from "../../../interfaces/Member";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Option } = Select;

function ApplyToSeller() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [years, setYears] = useState<YearsInterface[]>([]);
  const [instituteof, setinstituteof] = useState<InstituteOfInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [mid, setMid] = useState<number | null>(Number(localStorage.getItem("id")));
  const [membe, setMember] = useState<MemberInterface | null>(null);

  const GetMemberId = async (member_id: number) => {
    let res = await GetMemberById(member_id);

    if (res.status === 200) {
      setMember(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    setMid(Number(localStorage.getItem("id")));
    GetMemberId(mid); // Fetch member data when page loads
  }, [mid]);

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

  const CheckExistingSeller = async (studentID: string) => {
    try {
      // Check for seller using the lowercase version of studentID
      let resLowerCase = await GetSellerByStudentId(studentID.toLowerCase());
      
      // Check for seller using the uppercase version of studentID
      let resUpperCase = await GetSellerByStudentId(studentID.toUpperCase());
  
      // Check if either response is successful and has data
      if ((resLowerCase.status === 200 && resLowerCase.data) || 
          (resUpperCase.status === 200 && resUpperCase.data)) {
        return resLowerCase.data || resUpperCase.data; // Return existing seller data
      }
      
      return null; // No matching seller found
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดขณะตรวจสอบข้อมูลรหัสนักศึกษา!",
      });
      return null;
    }
  };
  

  const onFinish = async (values: SellerInterface) => {
    if (!fileList.length || !fileList[0]?.thumbUrl) {
      messageApi.open({
        type: "error",
        content: "กรุณาอัปโหลดรูปบัตรนักศึกษา!",
      });
      return;
    }

    if (mid === null) {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้, กรุณาลองใหม่อีกครั้ง!",
      });
      return;
    }

    const studentID = values.StudentID ?? "";
    values.PictureStudentID = fileList[0].thumbUrl;
    values.MemberId = mid;

    // Check if the StudentID is already used
    let existingSeller = await CheckExistingSeller(studentID);
    if (existingSeller) {
      messageApi.open({
        type: "error",
        content: "รหัสนักศึกษานี้ถูกใช้งานแล้ว! กรุณากรอกรหัสใหม่",
      });
      return;
    }


    // Proceed with creating the seller
    try {
      let res = await CreateSeller(values);
      if (res) {
        messageApi.open({
          type: "success",
          content: "บันทึกข้อมูลสำเร็จ",
        });
        setTimeout(() => {
          navigate("/HomeSeller");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดขณะบันทึกข้อมูล!",
      });
    }
  };

  const getyear = async () => {
    let res = await GetYear();
    if (res) {
      setYears(res);
    }
  };

  useEffect(() => {
    getyear();
  }, []);

  const getinstituteof = async () => {
    let res = await GetInstituteOf();
    if (res) {
      setinstituteof(res);
    }
  };

  useEffect(() => {
    getinstituteof();
  }, []);

  const handleBacktoHome = () => {
    navigate("/");
  };

  return (
    <div className='body'>
      <Flex>
        {contextHolder}
        <Card
          style={{
            marginTop: "30px",
            marginLeft: "60px",
            borderRadius: "12px",
            padding: "24px",
            background: "#e2dfdf",
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
                  style={{ width: "200px", marginRight: "20px" }}
                />
                <h2 style={{ margin: "0 70px" }}>
                  กรอกข้อมูลเพิ่มเติมสำหรับการยืนยันตัวตน
                </h2>
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

          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "-40px" }}>
            <Form layout="vertical" onFinish={onFinish} style={{ width: "400px" }}>
              {/* StudentID Form Field */}
              <Form.Item
                label="รหัสนักศึกษา"
                name="StudentID"
                rules={[
                  { required: true, message: "กรุณากรอกรหัสนักศึกษา!" },
                  {
                    pattern: /^[CcBb]\d{7}$/,
                    message: "รูปแบบไม่ถูกต้อง!",
                  },
                ]}
                style={{ marginBottom: "16px" }}
              >
                <Input placeholder="รหัสนักศึกษา" size="large" />
              </Form.Item>

              {/* Year Select Field */}
              <Form.Item
                label="ชั้นปี"
                name="YearsID"
                rules={[{ required: true, message: "กรุณาเลือกชั้นปี!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Select placeholder="เลือกชั้นปี" size="large">
                  {years.map((item) => (
                    <Option value={item.ID} key={item.Name}>
                      {item.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Institute Select Field */}
              <Form.Item
                label="สำนักวิชา"
                name="InstituteOfID"
                rules={[{ required: true, message: "กรุณาเลือกสำนักวิชา!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Select placeholder="เลือกสำนักวิชา" size="large">
                  {instituteof.map((item) => (
                    <Option value={item.ID} key={item.NameInstituteOf}>
                      {item.NameInstituteOf}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Major Input Field */}
              <Form.Item
                label="สาขา"
                name="Major"
                rules={[{ required: true, message: "กรุณาเลือกสาขา!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input placeholder="เลือกสาขา" size="large"></Input>
              </Form.Item>

              {/* Picture Upload Field */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="รูปบัตรนักศึกษา"
                  name="PictureStudentID"
                  valuePropName="fileList"
                  style={{ marginLeft: "-9px" }}
                >
                  <ImgCrop rotationSlider>
                    <Upload
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={(file) => {
                        setFileList([...fileList, file]);
                        return false;
                      }}
                      maxCount={1}
                      multiple={false}
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture"
                    >
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        style={{
                          backgroundColor: "#212020", // Background color
                          borderColor: "#181818", // Border color
                          color: "#fff", // Text color
                        }}
                      >
                        Upload
                      </Button>
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
                    marginTop: "-55px",
                    marginLeft: "750px",
                  }}
                >
                  ยืนยัน
                </Button>
              </Row>
            </Form>
          </Row>
        </Card>
      </Flex>
    </div>
  );
}

export default ApplyToSeller;