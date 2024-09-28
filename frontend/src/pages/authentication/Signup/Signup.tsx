import {Button,Card,Form,Input,message,Flex,Row,Col,} from "antd";

import { useNavigate } from "react-router-dom";

import { CreateMember } from "../../../services/http";

import { MemberInterface } from "../../../interfaces/Member";

import logo from "../../../assets/LogoOrange.png";

import { Link } from "react-router-dom";

import ImgCrop from "antd-img-crop"; // สำหรับครอบรูป

import { PlusOutlined } from "@ant-design/icons"; // ไอคอนสำหรับอัปโหลด

import type { UploadFile, UploadProps } from "antd";

import { useState } from "react";

import { Upload } from "antd";

import "./Signup.css"



function SignUpPages() {

  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  // เก็บไฟล์รูปโปรไฟล์ที่อัปโหลด
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // ฟังก์ชันการเปลี่ยนแปลงสำหรับการอัปโหลดรูปโปรไฟล์
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

   // ฟังก์ชันสำหรับการส่งข้อมูลสมาชิกพร้อมรูปโปรไฟล์
   const onFinish = async (values: MemberInterface) => {
    const file = fileList[0]?.originFileObj;

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        values.ProfilePic = base64data; // เพิ่ม base64 ของรูปโปรไฟล์ลงในข้อมูล

        let res = await CreateMember(values);
        if (res.status === 201) {
          messageApi.open({
            type: "success",
            content: res.data.message,
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          messageApi.open({
            type: "error",
            content: res.data.error,
          });
        }
      };
    } else {
      messageApi.open({
        type: "error",
        content: "กรุณาอัปโหลดรูปโปรไฟล์!",
      });
    }
  };





  return (

    <div className='body'>

      {contextHolder}

      <Flex justify="center" align="center" className="sign-up">

        <Card className="card-signup" style={{ width: 800 }}>

          <Row align={"middle"} justify={"center"}>

            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
            <center>
              <img alt="logo" src={logo} className="images-logo" />
            </center>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <center>
              <h2 className="header">Sign Up</h2>
            </center>

              <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">

                <Row gutter={[16, 0]} align={"middle"} justify={"center"}>

                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="ชื่อจริง"
                      name="first_name"
                      rules={[{required: true,message: "กรุณากรอกชื่อ !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="นามกสุล"
                      name="last_name"
                      rules={[{required: true,message: "กรุณากรอกนามสกุล !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="ชื่อผู้ใช้"
                      name="user_name"
                      rules={[{required: true,message: "กรุณากรอกชื่อผู็ใช้ !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="อีเมล"
                      name="email"
                      rules={[{type: "email",message: "รูปแบบอีเมลไม่ถูกต้อง !",},{required: true,message: "กรุณากรอกอีเมล !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="รหัสผ่าน"
                      name="password"
                      rules={[{required: true,message: "กรุณากรอกรหัสผ่าน !",},]}>
                      <Input.Password />
                    </Form.Item>
                  </Col>


                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="เบอร์โทรศัพท์"               
                      name="phonenumber"
                      rules={[{pattern: /^[0-9]{10}$/,required: true,message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง !",},]}>
                      <Input />
                    </Form.Item>
                  </Col>

                   {/* Upload Profile Image */}
                   <center>
                   <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item label="รูปประจำตัว" name="ProfilePic">
                      <ImgCrop aspect={1}>
                        <Upload
                          listType="picture-card"
                          fileList={fileList}
                          onChange={onChange}
                          onPreview={onPreview}
                          beforeUpload={() => false} // ไม่อัปโหลดทันที
                        >
                          {fileList.length < 1 && (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>อัพโหลด</div>
                            </div>
                          )}
                        </Upload>
                      </ImgCrop>
                    </Form.Item>
                  </Col></center>


                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item>
                      <center>
                        <Button type="primary" htmlType="submit" className="signuppage-button" style={{ marginBottom: 20 }}>
                          Sign up
                        </Button>
                        <Link to="/">
                          <Button type="primary" htmlType="submit" className="cancel-button" style={{ marginBottom: 20 }}>
                            Cancel
                          </Button>
                        </Link>
                      </center>
                    </Form.Item>
                  </Col>

                </Row>

              </Form>

            </Col>

          </Row>

        </Card>

      </Flex>

      </div>

  );

}


export default SignUpPages;