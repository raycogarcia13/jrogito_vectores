import * as React from 'react';

import { 
  Table, 
  Card, 
  Divider, 
  Typography, 
  Input,
  Select,
} from 'antd';

import { 
  ContainerOutlined, 
} from '@ant-design/icons';

import {api} from '../config/axios'

const { Option } = Select;
const { Column, ColumnGroup } = Table;

export default function DataTable() {
  const [data,setData] = React.useState([])
  const [tipos,setTipos] = React.useState([])
  const [tipo_sel,setTipoSel] = React.useState("")

  const loadData = ()=>{
    console.log(tipo_sel);
    api.get(`/reportes/tasa/${tipo_sel}`).then(res=>{
      setData(res.data.data);
    })
  }

  const loadTipos = ()=>{
    api.get('/nomenclador/tipos_e').then(res=>{
      const d = res.data.data; 
      setTipos(d)
      setTipoSel(d[0]._id)
    })
  }

  React.useEffect( ()=>{
    loadTipos();
  },[] )

  React.useEffect( ()=>{
    loadData();
  },[tipo_sel] )

  const changeSelect = (val)=>{
    setTipoSel(val);
  }

  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         <div style={{display:'flex', justifyContent:'space-between'}}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <ContainerOutlined style={{marginRight:10}}/>
              Tasa de Infestación
            </Typography.Title>
            <Select style={{ width: 300 }} value={tipo_sel} onChange={changeSelect}>
            {tipos.map(it=>{
              return (
                <Option value={it._id}>{it.tipo}</Option>
              )
            })}
            </Select>
         </div>

         <Divider />
          
         <Table  bordered dataSource={data}>
            <Column title="Área de salud" dataIndex="centro" key="centro" />
            <Column title="Población" dataIndex="poblacion" key="poblacion" />
            <Column title="Casos activos" dataIndex="activos" key="activos" />
            <Column title="Tasa de infestación" dataIndex="tasa" key="tasa" render={(item)=>{
              return (
                <>{Math.round(item*100)} %</>
              )
            }} />
            
          </Table>

      </Card>
  );
}