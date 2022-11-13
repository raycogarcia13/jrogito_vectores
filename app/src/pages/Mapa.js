import * as React from 'react';
import {useEffect, useState} from 'react';

import { 
  Card, 
  Typography, 
  Row,
  Col,
  Avatar,
  Button,
} from 'antd';

import { MapContainer, Marker, WMSTileLayer, LayersControl,Popup, TileLayer,useMap, useMapEvents, GeoJSON } from 'react-leaflet'

import Control from 'react-leaflet-custom-control'
import L,{ latLng } from "leaflet";
import {api} from '../config/axios'
import icon from 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import '@ozangokhanhergul/leaflet.heat'
import {consejos} from "../datas/consejos_populares"
import {viales} from "../datas/viales"
import hash from 'object-hash';

import { GeoSearchControl,OpenStreetMapProvider } from 'leaflet-geosearch';

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import Column from 'antd/lib/table/Column';

L.Marker.prototype.options.icon = L.icon({ iconUrl: icon })

// setup
const provider = new OpenStreetMapProvider();

export default function DataTable() {
  const [data, setData] = useState([]);
  const [data_v, setDataV] = useState([]);
  const [dengue, setPoints] = useState([]);
  const [virus, setVirus] = useState([]);
  const [vector, setVector] = useState([]);
  const [addedE, setAddedE] = useState(false);
  const [addedV, setAddedV] = useState(false);

  useEffect( ()=>{
    loadData();
  },[] )

  const loadData = async () =>{
    api.get('/epidemia').then(res=>{
      const d = res.data.data; 
      setDataV(d.map((it)=>{return {...it,key:it._id}}))
      const points = d.filter(it=>it.latlong!=null).map(it=>{
        return it.latlong
      })
      setPoints(points)

      let all = [];
      d.forEach( it=>{
        if(it=>it.latlong!=null){
          const index = all.findIndex(i=>i.tipo == it.tipo.tipo)
          if(index==-1){
            const t = {
              latlong: [],
              tipo: it.tipo.tipo,
              color:it.tipo.color
            }
            t.latlong.push(it.latlong);
            all.push(t);
          }else{
            all[index].latlong.push(it.latlong);
          }
        }
      })
      setVirus(all);
      
    })

    api.get('/vector').then(res=>{
      const d = res.data.data; 
      setData(d.map((it)=>{return {...it,key:it._id}}))
      const points = d.filter(it=>it.latlong!=null).map(it=>{
        return it.latlong
      })
      setVector(points)
    })
    
  }
  
  const searchControl = new GeoSearchControl({
    provider: provider,
    marker: {
      icon: L.icon({ iconUrl: icon }),
      draggable: false,
    },
    searchLabel: 'Buscar dirección', 
    style:'bar'
  });

  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState([]);
  const [tipo, setTipo] = useState("epidemia");
  
  const Markers = () => {
    
    // const markers = data.map(it=>{
    //   return <Marker key={it._id} position={it.latlong} interactive={false} />
    // })
    
    const map = useMap();
    
    data_v.map(it=>{
          const marker = L.marker(it.latlong,{opacity:0});
          marker.on('click',()=>{
            setVisible(true);
            setValues(it);
            setTipo('epidemia');
          });
          marker.addTo(map)

    })

    data.map(it=>{
          const marker = L.marker(it.latlong,{opacity:0});
          marker.on('click',()=>{
            setVisible(true);
            setValues(it);
            setTipo('vector');
          });
          marker.addTo(map)

    })
    
    return (
      <>
        {/* {markers} */}
        </>
    )   
  }

  const HeatLayer = () =>{
    const map = useMap();
    if(virus.length!=0 && !addedE){
      virus.map(it=>{
        const lay = L.heatLayer(it.latlong,{radius: 25, gradient:{1: it.color},blur:15, minOpacity:0.7})
        lay.addTo(map);
        setAddedE(true);
      })
    }
    return (<></>)
  }
  
  const VectorHeatLayer = ()=>{
    const map = useMap();
    if(vector.length!=0 && !addedV){
      console.log(vector)
      L.heatLayer(vector,{radius: 25, gradient:{1: 'blue'},blur:15, minOpacity:0.7}).addTo(map);
      setAddedV(true);
    }
    return (<></>)
  }
  
  const SearchField = ({ apiKey }) => {
    
  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);
  
  return null;
};

const SiderValues = () =>{
  return tipo=='epidemia'?(
    <Card style={{width:'300px'}}  >
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {values.nombre}
                    </Typography.Title>
                    <Button shape="circle" onClick={()=>closeData()}>X</Button>
                </div>
                <Row>
                  <table>
                    <tr>
                      <th>Epidemia</th>
                      <td style={{color:values.tipo.color}}>{values.tipo.tipo}</td>
                    </tr>
                    <tr>
                      <th>Edad</th>
                      <td>{values.edad}</td>
                    </tr>
                    <tr>
                      <th>Sexo</th>
                      <td>{values.sexo}</td>
                    </tr>
                    <tr>
                      <th>Dirección</th>
                      <td>{values.direccion}</td>
                    </tr>
                    <tr>
                      <th>Centro de Salud</th>
                      <td>{values.centro}</td>
                    </tr>
                    <tr>
                      <th>Fecha Resultado</th>
                      <td>{new Date(values.fecha_suma).toISOString().slice(0, 10)}</td>
                    </tr>
                    <tr>
                      <th>Personas en casa</th>
                      <td>{values.habitantes}</td>
                    </tr>
                    <tr>
                      <th>En la misma dirección</th>
                      <td>{values.cant_direction}</td>
                    </tr>
                  </table>
                </Row>
              </Card>
  ):(
    <Card style={{width:'300px'}}  >
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Vector
                    </Typography.Title>
                    <Button shape="circle" onClick={()=>closeData()}>X</Button>
                </div>
                <Row>
                  <table>
                    <tr>
                      <th>Dirección: </th>
                      <td>{`${values.calle}, e ${values.entre1} y ${values.entre2}, ${values.poblado}`} </td>
                    </tr>
                    <tr>
                      <th rowSpan={2}>Descripción</th>
                    </tr>
                    <tr>
                      <td rowSpan={2}>{values.descripcion}</td>
                    </tr>
                  </table>
                </Row>
              </Card>
  )
}

const click = async ()=>{
    const results = await provider.search({ query: "Calle 45 / 30 y 32 Nueva Gerona" });
}

const closeData = () =>{
  setVisible(false);
}

const onEachFeature = (feature, layer) =>{
  layer.bindTooltip(feature.properties.nombre.toString(), {permanent: true}).openTooltip();
}

  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         

         <MapContainer 
          fullscreenControl={true}
          style={{height: '80vh', zIndex:'1'}}
          bounds={[ [21.8932641596, -82.8244219401], [21.9016376414, -82.8096053901] ]} 
          center={latLng(21.75, -82.85)} 
          attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
          zoom={11} 
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
          <HeatLayer />
          <VectorHeatLayer />
          <Control prepend position='bottomright'>
            <Card color='inherit' > 
              <div style={{display:'flex', justifyContent:'space-between'}}>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                      Leyenda
                  </Typography.Title>
              </div>
                  {virus.map(it=>{
                    return (
                      <Row>
                        <Col><Avatar size={20} style={{ color: 'white', backgroundColor: it.color, opacity:0.5 }}></Avatar> {it.tipo}</Col>
                      </Row>
                    )
                  })}
              <Row>
                  <Col><Avatar size={20} style={{ color: 'white', backgroundColor: 'blue', opacity:0.5 }}></Avatar> Vectores</Col>
              </Row>
            </Card>
          </Control>
          {visible?(
            <Control append position='topright'>
              <SiderValues />
            </Control>
          ):(<></>)}
          {<SearchField  />}
        </MapContainer>


      </Card>
  );
}