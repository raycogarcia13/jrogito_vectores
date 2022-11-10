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
  Tag
} from 'antd';

import { Colorpicker, ColorPickerValue } from 'antd-colorpicker'

import { 
  ContainerOutlined, 
  DeleteOutlined, 
  EditOutlined 
} from '@ant-design/icons';

import {api} from '../config/axios'

const { TextArea } = Input;

export default function DataTable() {
  const [open, setOpen] = React.useState(false);
  const [open_delete, setOpenDelete] = React.useState(false);
  const [data,setData] = React.useState([])
  const [nuevo,setNuevo] = React.useState({})
  const [color,setColor] = React.useState('#f00')
  const [action,setAction] = React.useState("Nueva")
  
  const [form] = Form.useForm();
  
  const [id,setId] = React.useState("")
  const [status,setStatus] = React.useState('')

  const columns = [
    { dataIndex: 'name', key: 'name', title: 'Síntoma', },
    { dataIndex: 'descripcion', key: 'description', title: 'Descripción'},
    {
      key:'actions', title:'...',
      render: (item)=>{
        return (
           <Space>
            <Tooltip title="Editar">
              <Button onClick={()=>editOpen(item)} >
                <EditOutlined />  
              </Button>
            </Tooltip>
            <Tooltip title="Eliminar">
              <Button onClick={()=>deleteOpen(item)} type="danger" >
                <DeleteOutlined />
              </Button>
            </Tooltip>
            
          </Space>
        )
      }
    }
  ];

  const nuevoOpen = () => {
    setAction('Nueva')
    setOpen(true);
  };

  const editOpen = async (item) => {
    setId(item._id);
    form.setFieldsValue(item);
    setAction('Editar')
    setOpen(true);
  };

  const deleteOpen = async (item) => {
    setId(item._id);
    setOpenDelete(true);
  };

  const handleClose = () => {
    setNuevo({})
    form.resetFields();
    setOpen(false);
    setStatus('');
  };

  const handleCloseD = () => {
    setOpenDelete(false);
    setStatus('');
  };

  const submitForm = async (values) =>{
    setStatus('loading');
    if(action=='Nueva'){
      const uri = "/nomenclador/sintoma";
      api.post(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Síntoma insertada correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }else{
      const uri = `/nomenclador/sintoma/${id}`;
      api.put(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Síntoma actualizada correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }
  }

  const deleteUser = ()=>{
    console.log('ss')
    setStatus('loading')
    const uri = `/nomenclador/sintoma/${id}`;
    api.delete(uri).then(res=>{
      setStatus('recived')
      loadData();
      handleCloseD();
    })
  }

  const onFinishFailed = (errorInfo) => {
    setStatus('error')
    message.error('Error interno')
    console.log('Failed:', errorInfo);
  };

  const loadData = ()=>{
    api.get('/nomenclador/sintoma').then(res=>{
      const d = res.data.data; 
      setData(d.map((it)=>{return {...it,key:it._id}}))
    })
  }

  React.useEffect( ()=>{
    loadData();
  },[] )

  const loading = ()=>{
    return status == 'laading'?true:false
  }

  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         <div style={{display:'flex', justifyContent:'space-between'}}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <ContainerOutlined style={{marginRight:10}}/>
              Listado de Síntomas
            </Typography.Title>
          <Button onClick={nuevoOpen} type='primary'>Nuevo</Button>
         </div>

         <Divider />
          <Table
            dataSource={data}
            columns={columns}
          />

        <Modal
          title={`Eliminar tipo`}
          open={open_delete}
          confirmLoading={loading()}
          okText="Enviar"
          onCancel={handleClose}
          cancelText="Cancelar"
          footer={
            <>
              <Button key="btnclose" onClick={handleCloseD}>
                  Cancelar
              </Button>
              <Button type='primary' onClick={deleteUser} loading={loading()} key="btnsubmit" htmlType="submit">
                  Enviar
              </Button>
            </>
            }
          >
            Está seguro de querer eliminar este síntoma
        </Modal>
        <Modal
          title={`${action} tipo`}
          open={open}
          confirmLoading={loading()}
          okText="Enviar"
          onCancel={handleClose}
          cancelText="Cancelar"
          footer={
            <>
              <Button key="btnclose" onClick={handleClose}>
                  Cancelar
              </Button>
              <Button type='primary' onClick={form.submit} form={form} loading={loading()} key="btnsubmit" htmlType="submit">
                  Enviar
              </Button>
            </>
            }
          >
           <Form
              form={form}
              name="basic"
              labelCol={{ span: 5 }}
              layout="horizontal"
              initialValues={nuevo}
              onFinish={submitForm}
              onFinishFailed={onFinishFailed}
              autoComplete="on"
            >
              <Form.Item
                label="Nombre"
                name="name"
                rules={[{ required: true, message: 'Debe insertar el sintoma!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                label="Descripción" 
                name="descripcion" 
              >
                <TextArea autoSize={{ minRows: 3, maxRows: 5 }}/>
              </Form.Item>
             
            </Form>
        </Modal>

      </Card>
  );
}