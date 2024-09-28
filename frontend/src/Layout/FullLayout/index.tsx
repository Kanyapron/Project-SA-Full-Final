import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, Layout, theme, MenuProps } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  WechatOutlined,
  UnorderedListOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import Buyproduct from '../../pages/Products/Buy-Products/BuyProducts';
import Order from '../../pages/Products/Orders/Orders';
import PurchaseList from '../../pages/Products/Purchase-list/PurchaseList';
import MyProducts from '../../pages/Products/MyProducts/MyProducts';
import logo from "../../assets/logo.png";
import Profile from "../../pages/authentication/Member/Profile";
import HomeMember from '../../pages/Home/Member/homemember';


import '../../App.css';

const { Header, Content, Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: React.ReactNode;
  link?: string;
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  link?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    link,
  } as MenuItem;
}

const items: MenuItem[] = [
  {
    key: 'sub4',
    label: '',
    icon: <UnorderedListOutlined />,
    children: [
      { key: '1', label: 'บัญชีของฉัน', icon: <UserOutlined />, link: '/profile' },
      { key: '2', label: 'คำสั่งซื้อของฉัน', icon: <UnorderedListOutlined />, link: '/product' },
      { key: '3', label: 'ร้านค้าของฉัน', icon: <ShopOutlined />, link: '/Myproducts' },
    ],
  },
];

const FullLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('1');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '130vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ width: '100%' }}
            />
          </div>
          <Menu
            theme="dark"
            mode="inline"
          >
            <Menu.Item key="dashboard">
              <Link to="/">
                <HomeOutlined />
                <span>หน้าหลัก</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="index1">
              <Link to="/index">
                <WechatOutlined />
                <span>แชท</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="index">
              <Link to="/product">
                <UserOutlined />
                <span>ข้อมูลสินค้า</span>
              </Link>
            </Menu.Item>
          </Menu>
          <Menu
            defaultSelectedKeys={[current]}
            defaultOpenKeys={['sub4']}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            onClick={onClick}
          >
            {items.map(item => (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon}
                title={item.label}
              >
                {item.children?.map(subItem => (
                  <Menu.Item 
                    key={subItem.key} 
                    icon={subItem.icon}
                  >
                    <Link to={subItem.link} onClick={() => setCurrent(subItem.key)}>
                      {subItem.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '0 16px' }}>
            <Routes>
              <Route path="/HomeMember" element={<HomeMember />} />
              <Route path="/BuyProduct/:id" element={<Buyproduct />} />
              <Route path="/MyOrder" element={<PurchaseList />} />
              <Route path="/Card" element={<Order />} />
              <Route path="/Myproducts" element={<MyProducts />} />
              <Route path="/profile" element={<Profile />} /> {/* อย่าลืมเพิ่มคอมโพเนนต์นี้ */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default FullLayout;
