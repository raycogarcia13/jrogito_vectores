import * as React from 'react';

import { 
  Table, 
  Space, 
  Card, 
  Divider, 
  Typography, 
  Form,
  Input,
} from 'antd';

import { 
  ContainerOutlined, 
} from '@ant-design/icons';

import {api} from '../config/axios'

const { TextArea } = Input;
const { Column, ColumnGroup } = Table;

export default function DataTable() {
  const [data,setData] = React.useState([])

  const loadData = ()=>{
    api.get('/reportes/febriles').then(res=>{
      setData(res.data.data);
    })
  }

  React.useEffect( ()=>{
    loadData();
  },[] )


  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         <div style={{display:'flex', justifyContent:'space-between'}}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <ContainerOutlined style={{marginRight:10}}/>
              Febriles por áreas de salud
            </Typography.Title>
         </div>

         <Divider />
          
         <Table  bordered dataSource={data}>
            <Column title="Área de salud" dataIndex="centro" key="centro" />
            <ColumnGroup title="Febriles">
              <Column title="Día" dataIndex="fiebre_day" key="fiebre_day" />
              <Column title="Acomulado" dataIndex="fiebre_month" key="fiebre_month" />
            </ColumnGroup>
            <ColumnGroup title="IgM SUMA">
              <ColumnGroup title="Procesados">
                <Column title="Día" dataIndex="igm_day" key="igm_day" />
                <Column title="Acomulado" dataIndex="igm_month" key="igm_month" />
              </ColumnGroup>
              <ColumnGroup title="Reactivos">
                <Column title="Día" dataIndex="igm_positivo_dia" key="igm_positivo_dia" />
                <Column title="Acomulado" dataIndex="igm_positivo_month" key="igm_positivo_month" />
              </ColumnGroup>
            </ColumnGroup>
            
          </Table>

      </Card>
  );
}