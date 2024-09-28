import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Flex, Form, Row, message } from "antd";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/LogoOrange.png';
import backarrow from "../../../assets/back-arrow.png";
import { MemberInterface } from '../../../interfaces/Member';
import '../../../pages/authentication/Member/Profile.css';
import { GetMemberById, GetSellerByMemberId } from '../../../services/http';


function Profile() {

  const navigate = useNavigate();

  const [uid , setUid] = useState<number | null>(Number(localStorage.getItem("id")))
  
  const [messageApi, contextHolder] = message.useMessage();

  const [users, setUsers] = useState<MemberInterface | null>(null);
  
  const GetMemberid = async (user_id:number) => {

    let res = await GetMemberById(user_id);
    
    if (res.status == 200) {

      setUsers(res.data);

    } else {


      messageApi.open({

        type: "error",

        content: res.data.error,

      });

    }

  };

  useEffect(() => {
    setUid(Number(localStorage.getItem("id")))
    console.log(uid);
    GetMemberid(uid); // ดึงข้อมูลผู้ใช้เมื่อหน้าโหลด
  }, []);

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  const handleHome = async () => {
    if (uid === null) {
      messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
      return;
    }
  
    try {
      const sellerData = await GetSellerByMemberId(uid);
      if (sellerData && sellerData.error) {
        messageApi.open({
          type: "error",
          content: sellerData.error,
        });
        navigate('/HomeMember');
      } else if (sellerData) {
        navigate('/HomeSeller');
      } else {
        navigate('/HomeMember');
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ขาย",
      });
    }
  };


  return (<>
    {contextHolder}
    <div className='body'>

      <Flex justify="center" align="center" className="profile">

        <Card className="card-profile" style={{ width: 600,}} >

          <Row align={"middle"} justify={"center"} style={{ height: "400px" }}>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <img alt="logo" style={{ width: "15%" }} src={logo} className="images-logo-profile"/>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <center><h1 className='profile'>PROFILE</h1></center>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="back-arrow" onClick={handleHome}>
                <img src={backarrow} alt="backarrow" 
                    style={{width: "40px",cursor: "pointer",marginLeft: "500px",}}/>
              </div>
            </Col>

            <Form name="basic" layout="vertical">

            <div className='profilepic'>
              <Col xs={24} style={{ textAlign: 'center', marginBottom: 20}}>
                <Avatar size={250} src={users?.ProfilePic || undefined} icon={!users?.ProfilePic && <UserOutlined />} />
              </Col>
            </div>

            <div className="groupinfo">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item style={{ marginBottom: "5px" }}>
                  <label className="FirstName">First Name : {users?.FirstName}</label>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item style={{ marginBottom: "5px" }}>
                  <label className="LastName">Last Name : {users?.LastName}</label>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item style={{ marginBottom: "5px" }}>
                  <label className="username">Username : {users?.Username}</label>
                </Form.Item>
              </Col> 

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item style={{ marginBottom: "5px" }}>
                  <label className="email">Email : {users?.Email}</label>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item style={{ marginBottom: "5px" }}>
                  <label className="phonenumber">Phone Number : {users?.PhoneNumber}</label>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item style={{ marginBottom: "5px" }}>
                  <label className="Address">Address : {users?.Address}</label>
                </Form.Item>
              </Col>
            </div>

            </Form>

          </Row>

        </Card>

      </Flex>

    </div>

  </>);
}

export default Profile;
