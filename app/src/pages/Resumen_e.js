import * as React from 'react';

import { 
  Table, 
  Card, 
  Divider, 
  Typography, 
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
  const [tipos,setTipos] = React.useState([])

  const loadData = ()=>{
    api.get('/reportes/por_enferemedades').then(res=>{
      setData(res.data.data);
    })
  }

  const loadTipos = ()=>{
    api.get('/nomenclador/tipos_e').then(res=>{
      const d = res.data.data; 
      setTipos(d)
    })
  }

  React.useEffect( ()=>{
    loadData();
    loadTipos();
  },[] )


  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         <div style={{display:'flex', justifyContent:'space-between'}}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <ContainerOutlined style={{marginRight:10}}/>
              Resumen por enfermedades
            </Typography.Title>
         </div>

         <Divider />
          
         <Table  bordered dataSource={data}>
            <Column title="Área de salud" dataIndex="centro" key="centro" />
            <Column title="Total de casos" dataIndex="total" key="total" />
            {tipos.map(it=>{
              return(
                <ColumnGroup title={it.tipo}>
                  <ColumnGroup title="Procesados">
                    <Column title="Día" dataIndex={it.tipo} key={`${it.tipo}.dia`} render={ (cell)=>{
                      return (
                        <>{cell.dia}</>
                      )
                    } } />
                    <Column title="Acomulado" dataIndex={`${it.tipo}`} key="igm_month" render={ (cell)=>{
                      return (
                        <>{cell.mes}</>
                      )
                    } } />
                  </ColumnGroup>
                  <ColumnGroup title="Reactivos">
                    <Column title="Día" dataIndex={it.tipo} key="igm_positivo_dia" render={ (cell)=>{
                      return (
                        <>{cell.positivos_dia}</>
                      )
                    } } />
                    <Column title="Acomulado" dataIndex={it.tipo} key="igm_positivo_month" render={ (cell)=>{
                      return (
                        <>{cell.positivos_total}</>
                      )
                    } } />
                  </ColumnGroup>
                </ColumnGroup>

              )
            })}
            
          </Table>

      </Card>
  );
}