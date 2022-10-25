import * as React from 'react';

import { 
  Table, 
  Modal,
  message,
  Space, 
  Card, 
  Divider, 
  Button, 
  Typography, 
  Form,
  Input,
  Tooltip,
} from 'antd';

import { 
  ContainerOutlined, 
} from '@ant-design/icons';

import {api} from '../config/axios'


export default function DataTable() {

  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         <div style={{display:'flex', justifyContent:'space-between'}}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <ContainerOutlined style={{marginRight:10}}/>
              Página no encontrada
            </Typography.Title>
         </div>

         <Divider />
         Lo sentimos esa página no se encuentra disponible

      </Card>
  );
}