import * as React from 'react';
import {useEffect} from 'react';

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
  Tag,
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

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';


import { SearchOutlined } from '@ant-design/icons';

const { TextArea, Search } = Input;
const { Option } = Select;
const Context = React.createContext({ name: 'Default' });
const { Text } = Typography;

const options = {
  position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
  title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
  titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen
  content: null, // change the content of the button, can be HTML, default null
  forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
  forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
  fullscreenElement: false, // Dom element to render in full screen, false by default, fallback to map._container
};

export default function DataTable() {

  L.Marker.prototype.options.icon = L.icon({ iconUrl: icon })

  const [open, setOpen] = React.useState(false);
  const [open_delete, setOpenDelete] = React.useState(false);
  const [data,setData] = React.useState([])
  const [filtereData,setFData] = React.useState([])
  const [nuevo,setNuevo] = React.useState({})
  const [action,setAction] = React.useState("Nuevo")
  const [tipos,setTipos] = React.useState([])
  const [sintoma,setSintomas] = React.useState([])
  const [filter,setFilter] = React.useState("")


  const [initialPosition, setInitialPosition] = React.useState([0,0]);
  const [selectedPosition, setSelectedPosition] = React.useState([0,0]);
  
  const [form] = Form.useForm();
  
  const [id,setId] = React.useState("")
  const [status,setStatus] = React.useState('')

  const columns = [
    { dataIndex: 'codigo', key: 'codigo', title: 'Código' },
    { dataIndex: 'nombre', key: 'nombre', title: 'Paciente' },
    { dataIndex: 'edad', key: 'edad', title: 'Edad' },
    { dataIndex: 'sexo', key: 'sexo', title: 'Sexo' },
    { dataIndex: 'centro', key: 'centro', title: 'Centro' },
    { dataIndex: 'tipo', key: 'tipo', title: 'Enfermedad', render:(item)=>{
      return (
        <Space>
           <Tag color={item.color}>{item.tipo}</Tag>
        </Space>
      )
    } },
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
    setAction('Nuevo')
    setFilter("")
    setId("")
  };

  const handleCloseD = () => {
    setOpenDelete(false);
    setStatus('');
  };

  const submitForm = async (values) =>{
    if(id==''){
      message.error("Debe escoger un análisis")
    }
      setStatus('loading');
      const uri = `/epidemia/${id}`;
      api.put(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Resultado insertado')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
  }

  const onFinishFailed = (errorInfo) => {
    setStatus('error')
    message.error('Error interno')
    console.log('Failed:', errorInfo);
  };

  const loadData = ()=>{
    api.get('/epidemia').then(res=>{
      const d = res.data.data; 
      setData(d.filter(it=>it.resultado=="EN LABORATORIO").map((it)=>{return {...it,key:it._id}}))
      setFData(d.filter(it=>it.resultado=="EN LABORATORIO").map((it)=>{return {...it,key:it._id}}))
    })
  }
  const loadTipos = ()=>{
    api.get('/nomenclador/tipos_e').then(res=>{
      const d = res.data.data; 
      setTipos(d);
    })
  }
  const loadSintomas = ()=>{
    api.get('/nomenclador/sintoma').then(res=>{
      const d = res.data.data; 
      setSintomas(d);
    })
  }

  React.useEffect( ()=>{
    loadData();
    loadTipos();
    loadSintomas();
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


const onSearch = (s) =>{
  const values = data.filter(it=>it.nombre.toLowerCase().includes(s.toLowerCase()))
  setFData(values)
}
const changeSearch = (s) =>{
  console.log(s)
  setFilter(s.toLowerCase());
  const values = data.filter(it=>it.nombre.toLowerCase().includes(s.toLowerCase()))
  setFData(values)
}

  return (
    <>
     <Row>
     <Col span={8}>
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
                label="Nombre"
                name="nombre"
                rules={[{ required: true, message: 'Debe insertar el nombre!' }]}
              >
                <Input disabled/>
              </Form.Item>
              <Row>
                <Col span={10}>
                  <Form.Item
                    label="Código"
                    name="codigo"
                  >
                    <Input  disabled/>
                  </Form.Item>
                
                </Col>
                <Col offset={2} span={12}>
                  <Form.Item
                      label="Tipo de enfermedad"
                      name="tipo"
                    >
                    <Select disabled>
                      {tipos.map(it=><Option value={it._id}>{it.tipo}</Option>)}
                    </Select>
                  </Form.Item>
                
                </Col>
              </Row>
              <Form.Item
                  label="Fecha de salida del resultado"
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
          <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
            <Button type="danger" htmlType="button" onClick={ handleClose}>
              Cancelar
            </Button>
            &nbsp;
            <Button type="primary" htmlType="submit" disabled={id==''}>
              Insertar Resultado
            </Button>
          </Form.Item>

          </Form>

        </Card>
      </Col>
      <Col span={14} offset={1}>
          <Card style={{ width: '100%',paddingBottom:'10vh' }}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  <ContainerOutlined style={{marginRight:10}}/>
                  Registro de IGM
                </Typography.Title>

                <Search placeholder="Buscar"
                    onSearch={onSearch}
                    onChange={(e)=>changeSearch(e.target.value)}
                    value={filter}
                    enterButton = {<SearchOutlined />}
                    style={{ width: 200 }} />
            </div>

            <Divider />
              <Table
                dataSource={filtereData}
                columns={columns}
              />
          </Card>
      </Col>
     </Row>
      
    </>
  );
}