import * as React from 'react';
import {useEffect, useState} from 'react';

import { 
  Card, 
  Typography, 
  Row,
  Col,
  Avatar,
  Button
} from 'antd';

import { MapContainer, Marker, Popup, TileLayer,useMap, useMapEvents, GeoJSON } from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import L,{ latLng } from "leaflet";
import {api} from '../config/axios'
import icon from 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import '@ozangokhanhergul/leaflet.heat'
import {viales} from "../datas/viales"
import hash from 'object-hash';

import { GeoSearchControl,OpenStreetMapProvider } from 'leaflet-geosearch';

import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';


L.Marker.prototype.options.icon = L.icon({ iconUrl: icon })

// setup
const provider = new OpenStreetMapProvider();

export default function DataTable() {
  const [data, setData] = useState([]);
  const [data_v, setDataV] = useState([]);
  const [dengue, setPoints] = useState([]);
  const [virus, setVirus] = useState([]);
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
            all[index].latLng.push(it.latlong);
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

  const Markers = () => {

    const markers = data.map(it=>{
      return <Marker key={it._id} position={it.latlong} interactive={false} />
    })

    const map = useMap();

    virus.map(it=>{
      console.log(it)
      L.heatLayer(it.latlong,{radius: 25, gradient:{1: it.color},blur:15, minOpacity:0.3}).addTo(map);
    })
    console.log(vector)
    L.heatLayer(vector,{radius: 25, gradient:{1: 'blue'},blur:15, minOpacity:0.3}).addTo(map);

    return (
        <>
        {/* {markers} */}
        </>
    )   
}

const SearchField = ({ apiKey }) => {

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

const click = async ()=>{
    const results = await provider.search({ query: "Calle 45 / 30 y 32 Nueva Gerona" });
    console.log(results); 
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
          <TileLayer
            attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Markers />
          {/* <GeoJSON key={hash('jp;a')} style={{ fillColor: "#ff7800",color: "rgba(3,3,3,0.1)"}} data={viales} /> */}
          <Control prepend position='bottomright'>
            <Card color='inherit'> 
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
          {<SearchField  />}
        </MapContainer>


      </Card>
  );
}