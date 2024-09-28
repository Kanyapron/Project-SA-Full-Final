
import './Login.css';
import logo from '../../../assets/LogoOrange.png';
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Col, Flex, Card, Row } from "antd";
import { LoginInterface } from '../../../interfaces/Login';
import { Login, GetSellerByMemberId } from "../../../services/http/index";

function LoginPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: LoginInterface) => {
    try {
      let res = await Login(values);
      console.log(res); // Log the response to inspect the data received from the API

      if (res.status === 200) {
        messageApi.success("Log-in successful");

        // Store necessary information in localStorage
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token_type", res.data.token_type);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);

        // Check if the user has a seller account
        let sellerRes = await GetSellerByMemberId(res.data.id);

        if (sellerRes.error) {
          // If no seller data exists, redirect to /HomeMember
          // messageApi.info("No seller account associated with this member.");
          localStorage.removeItem("sellerId"); // Clear any existing sellerId
          setTimeout(() => {
            navigate("/HomeMember");
          }, 1000);
        } else {
          // If seller data exists, store sellerId and redirect to /HomeSeller
          // messageApi.success("Seller account found, redirecting to seller home.");
          localStorage.setItem("sellerId", sellerRes.id); // Store sellerId
          setTimeout(() => {
            navigate("/HomeSeller");
          }, 1000);
        }
      } else {
        messageApi.error(res.data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      messageApi.error("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div className='body'>
    <>
      {contextHolder}
      <Flex justify="center" align="center" className="login">
        <Card className="card-login" style={{ width: 600 }}>
          <Row align={"middle"} justify={"center"} style={{ height: "400px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <center>
                <img alt="logo" style={{ width: "30%" }} src={logo} className="images-logo" />
              </center>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input your email!" }]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}>
                  <Input.Password />
                </Form.Item>

                <center>
                  <Button type="primary" htmlType="submit" className="loginpage-button" style={{ width: "20vh" }}>
                    Log In
                  </Button>
                  <Button
                    type="primary"
                    className="cancelloginpage-button"
                    style={{ width: "20vh" }}
                    onClick={() => navigate("/")}>
                    Cancel
                  </Button>
                  <div className="signup-now">
                    Or <a onClick={() => navigate("/SignupPage")}>signup now!</a>
                  </div>
                </center>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </>
    </div>
  );
}

export default LoginPage;