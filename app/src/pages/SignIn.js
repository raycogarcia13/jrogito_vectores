import React from "react";
import {useEffect} from 'react';
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Divider,
  Alert
} from "antd";
import signinbg from "../assets/images/img-signin.jpg";
import { loginAction } from '../store/auth/authActions'
import { useDispatch, useSelector } from 'react-redux';
import { useAuth} from '../auth'


const { Title } = Typography;
const { Header, Footer, Content } = Layout;

// export default class SignIn extends Component {
  export default function SignIn(){
    const data = useAuth();
    const dispatch = useDispatch();
    const { loading, user,token,error, logged } = useSelector(state=>state.auth)

    useEffect( ()=>{
      if(logged){
          data.onLogin({user,token});
      }
    })

    const onFinish = async (values) => {
      dispatch(loginAction(values));
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
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
        <Layout className="layout-default layout-signin">
          <Header>
            <div className="header-col header-brand">
              <h5>Vectores Salud</h5>
            </div>
          
          </Header>
          <Content className="signin">
            <Row gutter={[24, 0]} justify="space-around">
              <Col
                xs={{ span: 24, offset: 0 }}
                lg={{ span: 6, offset: 2 }}
                md={{ span: 12 }}
              >
                <Title className="mb-15">Entrar</Title>
                <Title className="font-regular text-muted" level={5}>
                  Inserte su correo para autenticarse en el sistema
                </Title>
                <Form
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  layout="vertical"
                  className="row-col"
                >
                  <Form.Item
                    className="username"
                    label="Correo"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Debe insertar el correo!",
                      },
                    ]}
                  >
                    <Input placeholder="Correo" />
                  </Form.Item>

                  <Form.Item
                    className="username"
                    label="Contraseña"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Debe insertar la contraseña!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  {message()}
                    <Divider />

                  <Form.Item>
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Entrar
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col
                className="sign-img"
                style={{ padding: 12 }}
                xs={{ span: 24 }}
                lg={{ span: 12 }}
                md={{ span: 12 }}
              >
                <img src={signinbg} alt="" />
              </Col>
            </Row>
          </Content>
          <Footer>
            <p className="copyright">
              {" "}
              Copyright © 2022 Salud by <a href="#pablo">R@ncode</a>.{" "}
            </p>
          </Footer>
        </Layout>
      </>
    );
  }
