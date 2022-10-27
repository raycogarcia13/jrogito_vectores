import * as React from 'react';

import { 
  Table, 
  Modal,
  message,
  DatePicker,
  Space, 
  Card, 
  Divider, 
  Button, 
  Typography, 
  Form,
  Input,
  Tooltip,
  Row, 
  Col,
  Select,
  notification
} from 'antd';
import icon from 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/leaflet.css'
import { 
  ContainerOutlined, 
  DeleteOutlined, 
  EditOutlined 
} from '@ant-design/icons';

import {api} from '../config/axios'
import moment from 'moment';

import { MapContainer, Marker, Popup, TileLayer,useMap, useMapEvents } from 'react-leaflet'
import L,{ latLng } from "leaflet";
const { TextArea } = Input;
const { Option } = Select;
const Context = React.createContext({ name: 'Default' });

export default function DataTable() {
  L.Marker.prototype.options.icon = L.icon({ iconUrl: icon })

  const [open, setOpen] = React.useState(false);
  const [open_delete, setOpenDelete] = React.useState(false);
  const [data,setData] = React.useState([])
  const [nuevo,setNuevo] = React.useState({})
  const [action,setAction] = React.useState("Nuevo")

  const [initialPosition, setInitialPosition] = React.useState([0,0]);
  const [selectedPosition, setSelectedPosition] = React.useState([0,0]);
  
  const [form] = Form.useForm();
  
  const [id,setId] = React.useState("")
  const [status,setStatus] = React.useState('')

  const columns = [
    { dataIndex: 'codigo', key: 'codigo', title: 'Código' },
    { dataIndex: 'nombre', key: 'nombre', title: 'Paciente' },
    { dataIndex: 'edad', key: 'edad', title: 'Edad' },
    { dataIndex: 'centro', key: 'centro', title: 'Centro' },
    { dataIndex: 'resultado', key: 'resultado', title: 'Resultado' },
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
          </Space>
        )
      }
    }
  ];

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition([latitude, longitude]);
        console.log(initialPosition);
    });
}, []);


  const editOpen = async (item) => {
    setId(item._id);
    setSelectedPosition(item.latlong)
    item.fecha_primera = moment(item.fecha_primera);
    item.fecha_muestra = moment(item.fecha_muestra);
    item.fecha_suma = moment(item.fecha_suma);
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
    setStatus('');
  };

  const handleCloseD = () => {
    setOpenDelete(false);
    setStatus('');
  };

  const submitForm = async (values) =>{
    if(values.resultado == 'POSITIVO' && selectedPosition[0]==0){
      openNotification('error','Faltan datos', 'Debe escoger le punto de geolocaalización, ya que la automática no se ha podido completar')
      return;
    }
    setStatus('loading');
    values.latlong = selectedPosition;
    if(action=='Nuevo'){
      const uri = "/epidemia";
      api.post(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Igm Insertado correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }else{
      const uri = `/epidemia/${id}`;
      api.put(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Igm actualizado correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }
  }

  const onFinishFailed = (errorInfo) => {
    setStatus('error')
    message.error('Error interno')
    console.log('Failed:', errorInfo);
  };

  const loadData = ()=>{
    api.get('/epidemia').then(res=>{
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

  const Markers = () => {

    const map = useMapEvents({
        click(e) {                                
            setSelectedPosition([
                e.latlng.lat,
                e.latlng.lng
            ]);   
        }           
    })

    return (
        selectedPosition ? 
            <Marker           
            key={selectedPosition[0]}
            position={selectedPosition}
            interactive={false} 
            />
        : null
    )   
    
}

const openNotification = (type,title,text) => {
  notification[type]({
    message: title,
    description:text
  });
};

  return (
    <>
     <Row>
     <Col span={6}>
        <Card>
        <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  <ContainerOutlined style={{marginRight:10}}/>
                  {action} IGM
                </Typography.Title>
            </div>
            <Divider />

          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={nuevo}
            onFinish={submitForm}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
          >
                <Form.Item
                  label="Código suma"
                  name="codigo"
                  rules={[{ required: true, message: 'Debe insertar el código' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                label="Nombre"
                name="nombre"
                rules={[{ required: true, message: 'Debe insertar el nombre!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                  label="Dirección"
                  name="direccion"
                  rules={[{ required: true, message: 'Debe insertar la dirección' }]}
                >
                  <TextArea autoSize={{ minRows: 3, maxRows: 5 }}/>
                </Form.Item>
                <Form.Item
                  label="Carnet de Identidad"
                  name="carnet"
                  rules={[
                    { required: true, message: 'Debe insertar el carnet!' },
                    { min: 11, message: 'Debe tener 11 caracteres.' },
                    { max: 11, message: 'Debe tener 11 caracteres.' },
                  ]}
                >
                <Input type='number'/>
              </Form.Item>
              <Form.Item
                  label="Fecha primeros síntomas"
                  name="fecha_primera"
                  rules={[{ required: true, message: 'Debe insertar la fecha!' }]}
                >
                <DatePicker style={{ width: '100%' }}/>
              </Form.Item>
              <Form.Item
                  label="Fecha de la toma de la muestra"
                  name="fecha_muestra"
                  rules={[{ required: true, message: 'Debe insertar la fecha!' }]}
                >
                <DatePicker style={{ width: '100%' }}/>
              </Form.Item>
              <Form.Item
                  label="Centro / Hospital"
                  name="centro"
                >
                <Select defaultValue="Hospital">
                  <Option value="Hospital">Hospital</Option>
                  <Option value="Policlínico 1">Policlínico 1</Option>
                  <Option value="Policlínico 2">Policlínico 2</Option>
                  <Option value="Policlínico 3">Policlínico 3</Option>
                </Select>
              </Form.Item>
              <Form.Item
                  label="Fecha de salida del suma"
                  name="fecha_suma"
                  rules={[{ required: true, message: 'Debe insertar la fecha!' }]}
                >
                <DatePicker style={{ width: '100%' }}/>
              </Form.Item>
              <Form.Item
                  label="Resultado"
                  name="resultado"
                >
                <Select defaultValue="NEGATIVO">
                  <Option value="POSITIVO">POSITIVO</Option>
                  <Option value="NEGATIVO">NEGATIVO</Option>
                </Select>
              </Form.Item>
           <Divider />
          <MapContainer 
          style={{height: '50vh', zIndex:'1'}}
            bounds={[ [21.8932641596, -82.8244219401], [21.9016376414, -82.8096053901] ]} 
            center={latLng(21.75, -82.85)} 
            attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
            zoom={15} 
            scrollWheelZoom={true}>
            <TileLayer
              attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
              url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            <Markers />
          </MapContainer>
          <Divider />
          <Form.Item wrapperCol={{ span: 12, offset: 11 }}>
            <Button type="primary" htmlType="submit">
              {action}
            </Button>
          </Form.Item>

          </Form>

        </Card>
      </Col>
      <Col span={16} offset={1}>
          <Card style={{ width: '100%',paddingBottom:'10vh' }}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  <ContainerOutlined style={{marginRight:10}}/>
                  Registro de IGM
                </Typography.Title>
            </div>

            <Divider />
              <Table
                dataSource={data}
                columns={columns}
              />
          </Card>
      </Col>
     </Row>
      
    </>
  );
}