import * as React from 'react';

import Router from '../router'
import Menu from '../components/Menu'
import Copyright from '../components/Copyright'

import { useAuth } from '../auth';
import '../App.css'

import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../store/auth/authActions'

import { Button, Layout, Tooltip } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

function DashboardContent({ token, logout}) {
  const [collapsed, setCollapsed] = React.useState(false);
  
  const toggle = () => {
    setCollapsed(!collapsed)
  };

  const dispatch = useDispatch();
  // const myuser = user.user

  const { user } = useSelector(state=>state.auth)

  const onLogout = async () =>{
    await dispatch(logoutAction());
    logout();
  }

  return (
    <Layout style={{height:'100vh'}}>
        <Sider theme='light' trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
             <img width={'90%'} src={require('../assets/image/enpa.png')}/>
          </div>
          <Menu />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle,
            })}
            
            <div>
              {(user) ?user.name:'Loading...'} &nbsp;
              <Tooltip title="Salir">
                <Button onClick={()=>{onLogout()}} shape='circle' icon={<LogoutOutlined />}></Button>
              </Tooltip>
            </div>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
             <Router />
          </Content>
          <Copyright />
        </Layout>
      </Layout>
  );
}

export default function Dashboard() {
  const data = useAuth();
  return <DashboardContent user={data.user} token={data.token} logout={data.onLogout} />;
}