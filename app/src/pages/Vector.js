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
  Switch,
  Row, 
  Col,
  Tag,
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


import {consejos} from "../datas/consejos_populares"
import {viales} from "../datas/viales"
import hash from 'object-hash';

import { LayersControl, WMSTileLayer,GeoJSON, MapContainer, Marker, Popup, TileLayer,useMap, useMapEvents } from 'react-leaflet'
import L,{ latLng } from "leaflet";
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
const { TextArea } = Input;
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
    { dataIndex: 'calle', key: 'calle', title: 'Calle' },
    { dataIndex: 'entre1', key: 'entre1', title: 'Entre 1' },
    { dataIndex: 'entre2', key: 'entre2', title: 'Entre 2' },
    { dataIndex: 'manzana', key: 'manzana', title: 'Manzana' },
    { dataIndex: 'larvas', key: 'larvas', title: 'Vector',render: vec => (
      <span>
          <Tag color={vec?'red':'green'} >
            { vec ? 'SI' : 'NO' }
          </Tag>
      </span>
    ), },
    { dataIndex: 'descripcion', key: 'descripcion', title: 'Descripción' },
    {
      fixed:'right',
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
    setSelectedPosition([0,0])
    setAction('nuevo');
  };

  const handleCloseD = () => {
    setOpenDelete(false);
    setStatus('');
  };

  const submitForm = async (values) =>{
    if(values.larvas && selectedPosition[0]==0){
      openNotification('error','Faltan datos', 'Debe escoger le punto de geolocaalización, ya que la automática no se ha podido completar')
      return;
    }
    setStatus('loading');
    values.latlong = selectedPosition;
    if(action=='Nuevo'){
      const uri = "/vector";
      api.post(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Vector Insertado correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }else{
      const uri = `/vector/${id}`;
      api.put(uri,values).then(res=>{
        loadData();
        setStatus('recived');
        message.success('Vector actualizado correctamente')
        handleClose();
      }).catch(err=>{
        message.error(err.message)
      })
    }
  }

  const deleteUser = ()=>{
    setStatus('loading')
    const uri = `/vector/${id}`;
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
    api.get('/vector').then(res=>{
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

const onEachFeature = (feature, layer) =>{
  layer.bindTooltip(feature.properties.nombre.toString(), {permanent: true}).openTooltip();
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
     <Col span={12}>
        <Card>
        <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  <ContainerOutlined style={{marginRight:10}}/>
                  {action} Vector
                </Typography.Title>
            </div>
            <Divider />

            <Modal
              title={`Eliminar vector`}
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
                Está seguro de querer eliminar este vector
            </Modal>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={nuevo}
            onFinish={submitForm}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
          >
            <Row align='center'>
              <Col offset={1}>
                <Form.Item
                  label="Calle"
                  name="calle"
                  rules={[{ required: true, message: 'Debe insertar la calle' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col offset={1}>
                <Form.Item
                label="Entre 1"
                name="entre1"
                rules={[{ required: true, message: 'Debe insertar la calle!' }]}
              >
                <Input />
              </Form.Item>
              </Col>
              <Col offset={1}>
                <Form.Item
                label="Entre 2"
                name="entre2"
                rules={[{ required: true, message: 'Debe insertar la calle!' }]}
              >
                <Input />
              </Form.Item>
              </Col>
              <Col offset={1}>
                <Form.Item
                label="Poblado"
                name="poblado"
                rules={[{ required: true, message: 'Debe insertar el poblado!' }]}
              >
                <Input />
              </Form.Item>
              </Col>
              <Col offset={1}>
                <Form.Item
                label="Manzana"
                name="manzana"
                rules={[{ required: true, message: 'Debe insertar la manzana!' }]}
              >
                <Input type='number'/>
              </Form.Item>
              </Col>
              <Col offset={1}>
                <Form.Item
                label="Existe vector"
                name="larvas"
                valuePropName="checked"
              >
                <Switch checkedChildren="SI" unCheckedChildren="NO"/>
              </Form.Item>
              </Col>
            </Row>
            <Form.Item
                label="Descripción"
                name="descripcion"
                rules={[{ required: true, message: 'Debe insertar la descripción' }]}
              >
                <TextArea autoSize={{ minRows: 3, maxRows: 5 }}/>
              </Form.Item>
           <Divider />
          <MapContainer 
            fullscreenControl={true}
            style={{height: '50vh', zIndex:'1'}}
            bounds={[ [21.8932641596, -82.8244219401], [21.9016376414, -82.8096053901] ]} 
            center={latLng(21.75, -82.85)} 
            attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
            zoom={10} 
            scrollWheelZoom={true}>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Andariego">
                  <WMSTileLayer
                      layers={'osm'}
                      url="https://cache.andariego.cu/wms"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="OSM">
                <TileLayer
                  attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
                  url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Litoral">
                  <GeoJSON key={hash('jp;a')} style={{ fillColor: "#BDDAB1",color: "rgba(3,3,3,0.1)"}}  onEachFeature={onEachFeature} data={consejos} />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay name="Viales">
                  <GeoJSON key={hash('jpg')} style={{ fillColor: "#BDDAB1",color: "rgba(3,3,3,0.1)"}}  data={viales} />
                </LayersControl.Overlay>
            </LayersControl>
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
      <Col span={11} offset={1}>
          <Card style={{ width: '100%',paddingBottom:'10vh' }}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  <ContainerOutlined style={{marginRight:10}}/>
                  Puntos de vectores
                </Typography.Title>
            </div>

            <Divider />
              <Table
                scroll={{x:'auto'}}
                dataSource={data}
                columns={columns}
              />
          </Card>
      </Col>
     </Row>
      
    </>
  );
}