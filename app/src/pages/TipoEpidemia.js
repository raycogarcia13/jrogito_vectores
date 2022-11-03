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
    { dataIndex: 'tipo', key: 'tipo', title: 'Tipo epidemia', },
    { dataIndex: 'color', key: 'color', title: 'color', render: (item)=>{
      return (
         <Space>
          <Tag color={item}>{item}</Tag>
        </Space>
      )
    }},
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
    const c = values.color
    values.color = `rgba(${values.color.r},${values.color.g},${values.color.b},${values.color.a})`
    values.color = rgba2hex(values.color);
    if(action=='Nueva'){
      const uri = "/nomenclador/tipos_e";
      api.post(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Tipo de enfermedad insertada correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }else{
      const uri = `/nomenclador/tipos_e/${id}`;
      api.put(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Tipo de enfermedad actualizada correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }
  }

  const deleteUser = ()=>{
    console.log('ss')
    setStatus('loading')
    const uri = `/nomenclador/tipos_e/${id}`;
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
    api.get('/nomenclador/tipos_e').then(res=>{
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

  const rgba2hex = (orig)=>{
    var a, isPercent,
      rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
      alpha = (rgb && rgb[4] || "").trim(),
      hex = rgb ?
      (rgb[1] | 1 << 8).toString(16).slice(1) +
      (rgb[2] | 1 << 8).toString(16).slice(1) +
      (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
  
    if (alpha !== "") {
      a = alpha;
    } else {
      a = '01';
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;
  
    return `#${hex}`;
  }

  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         <div style={{display:'flex', justifyContent:'space-between'}}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <ContainerOutlined style={{marginRight:10}}/>
              Tipos de enfermedad
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
            Está seguro de querer eliminar este usuario
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
                name="tipo"
                rules={[{ required: true, message: 'Debe insertar la enferemdad!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                label="Color" 
                name="color" 
                rules={[{ required: true, message: 'Debe insertar el color!' }]}
              >
                <Colorpicker popup picker='CirclePicker' onColorResult={(color) => color.rgb}/>
              </Form.Item>
             
            </Form>
        </Modal>

      </Card>
  );
}