import * as React from 'react';
import {useEffect, useState} from 'react';

import { 
  Card, 
  Typography, 
  Row,
  Col,
  Avatar
} from 'antd';

import { MapContainer, Marker, Popup, TileLayer,useMap, useMapEvents } from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import L,{ latLng } from "leaflet";
import {api} from '../config/axios'
import icon from 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/leaflet.css'
import '@ozangokhanhergul/leaflet.heat'

export default function DataTable() {
  L.Marker.prototype.options.icon = L.icon({ iconUrl: icon })
  const [data, setData] = useState([]);
  const [data_v, setDataV] = useState([]);
  const [dengue, setPoints] = useState([]);
  const [vector, setVector] = useState([]);

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

  const Markers = () => {

    const markers = data.map(it=>{
      return <Marker key={it._id} position={it.latlong} interactive={false} />
    })

    const map = useMap();

    L.heatLayer(dengue,{radius: 25, gradient:{1: 'red'},blur:15, minOpacity:0.3}).addTo(map);
    L.heatLayer(vector,{radius: 25, gradient:{1: 'blue'},blur:15, minOpacity:0.3}).addTo(map);


    return (
        <>
        {/* {markers} */}
        </>
    )   
}

  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         
         <MapContainer 
         style={{height: '80vh', zIndex:'1'}}
          bounds={[ [21.8932641596, -82.8244219401], [21.9016376414, -82.8096053901] ]} 
          center={latLng(21.75, -82.85)} 
          attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
          zoom={11} 
          scrollWheelZoom={true}>
          <TileLayer
            attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Markers />

          <Control prepend position='bottomright'>
            <Card color='inherit'> 
              <div style={{display:'flex', justifyContent:'space-between'}}>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                      Leyenda
                  </Typography.Title>
              </div>
              <Row>
                  <Col><Avatar size={20} style={{ color: 'white', backgroundColor: 'red', opacity:0.5 }}></Avatar> IGM positivos</Col>
              </Row>
              <Row>
                  <Col><Avatar size={20} style={{ color: 'white', backgroundColor: 'blue', opacity:0.5 }}></Avatar> Vectores</Col>
              </Row>
            </Card>
          </Control>

        </MapContainer>


      </Card>
  );
}