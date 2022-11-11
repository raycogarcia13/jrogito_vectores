/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// import { useState } from "react";
import { Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

import { 
  HeatMapOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];


  const profile = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const signin = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const signup = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      key={0}
    >
      <path
        d="M0,2A2,2,0,0,1,2,0H8a2,2,0,0,1,2,2V8a2,2,0,0,1-2,2H2A2,2,0,0,1,0,8Z"
        transform="translate(4 4)"
        fill={color}
      />
      <path
        d="M2,0A2,2,0,0,0,0,2V8a2,2,0,0,0,2,2V4A2,2,0,0,1,4,2h6A2,2,0,0,0,8,0Z"
        fill={color}
      />
    </svg>,
  ];

  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Vectores Salud</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/home">
            <span
              className="icon"
              style={{
                background: page === "dashboard" ? color : "",
              }}
            >
              {dashboard}
            </span>
            <span className="label">Inicio</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item className="menu-item-header" key="14">
          Reportes
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/febriles">
            <span
              className="icon"
              style={{
                background: page === "mapa" ? color : "",
              }}
            >
              <DatabaseOutlined />
            </span>
            <span className="label">Febriles </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/enfermedad">
            <span
              className="icon"
              style={{
                background: page === "mapa" ? color : "",
              }}
            >
              <DatabaseOutlined />
            </span>
            <span className="label">Por enfermedades</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/tasa">
            <span
              className="icon"
              style={{
                background: page === "mapa" ? color : "",
              }}
            >
              <DatabaseOutlined />
            </span>
            <span className="label">Tasa de infestación</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item className="menu-item-header" key="14">
          Mapa
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/mapa">
            <span
              className="icon"
              style={{
                background: page === "mapa" ? color : "",
              }}
            >
              {<HeatMapOutlined />}
            </span>
            <span className="label">Estratificación</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item className="menu-item-header" key="13">
          Gestión
        </Menu.Item>
        <Menu.Item key="4">
          <NavLink to="/vectores">
            <span
              className="icon"
              style={{
                background: page === "vector" ? color : "",
              }}
            >
            <DatabaseOutlined />
            </span>
            <span className="label">Vectores</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="4">
          <NavLink to="/epidemia">
            <span
              className="icon"
              style={{
                background: page === "epidemia" ? color : "",
              }}
            >
            <DatabaseOutlined />
            </span>
            <span className="label">Epidemiología</span>
          </NavLink>
        </Menu.Item>

        <Menu.Item className="menu-item-header" key="12">
          Nomencladores
        </Menu.Item>
        <Menu.Item key="5">
          <NavLink to="/nomenclador_tipo">
            <span
              className="icon"
              style={{
                background: page === "profile" ? color : "",
              }}
            >
              <DatabaseOutlined />
            </span>
            <span className="label">Tipo de epidemia</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="5">
          <NavLink to="/nomenclador_sintoma">
            <span
              className="icon"
              style={{
                background: page === "profile" ? color : "",
              }}
            >
              <DatabaseOutlined />
            </span>
            <span className="label">Síntomas</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item className="menu-item-header" key="11">
          Administrativas
        </Menu.Item>
        <Menu.Item key="7">
          <NavLink to="/usuarios">
            <span
              className="icon"
              style={{
                background: page === "usuarios" ? color : "",
              }}
            >
              {profile}
            </span>
            <span className="label">Usuarios</span>
          </NavLink>
        </Menu.Item>
        
      </Menu>
    </>
  );
}

export default Sidenav;
