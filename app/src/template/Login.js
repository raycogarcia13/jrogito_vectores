import {useEffect} from 'react';
import { 
  Alert,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Typography,
  Button
} from 'antd';

import {
  LockOutlined
} from '@ant-design/icons'


import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../store/auth/authActions'

import { useAuth} from '../auth'
import { Content } from 'antd/lib/layout/layout';

const { Text } = Typography;

const Login = (props) => {
  const data = useAuth();
  const dispatch = useDispatch();
  const { loading, user,token,error, logged } = useSelector(state=>state.auth)

  useEffect( ()=>{
    if(logged){
        data.onLogin({user,token});
    }
  })

  const onFinish = async (values) => {
    dispatch(await loginAction(values));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const message = ()=>{
    if(error)
      return (
        <Alert message={error} type="error" showIcon />
      )
      return  (<></>)
  }

  return (
    <>
      <Layout>
        <Content style={{height:'100vh'}}>
          <Row style={{height:'100%'}} type="flex" justify="space-around" align='middle'>
            <Col md={8} sm={12} xs={20}>
              <Card bordered={true}>
                <Row type="flex" justify='center' align="middle"  gutter={8}>
                  <Col>
                      <LockOutlined style={{color:'green', fontSize:24}} />
                  </Col>
                  <Col>
                    <Text type="success"> SIG ENPA </Text>
                  </Col>
                </Row>
                <Divider></Divider>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Usuario"
                      name="username"
                      rules={[{ required: true, message: 'Debe insertar su usuario!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Contraseña"
                      name="password"
                      rules={[{ required: true, message: 'Debe insertar una contraseña válida!' }]}
                    >
                      <Input.Password />
                    </Form.Item>

                    {message()}
                    <Divider />

                    <Form.Item wrapperCol={{ offset: 12 }}>
                      <Button type="primary" loading={loading} block style={{ background: "#007a3d", borderColor:"#007a3d" }} htmlType="submit">
                        Entrar
                      </Button>
                    </Form.Item>
                  </Form>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
}

export default Login;