
import { Header } from 'antd/es/layout/layout'
import React from 'react'
import logo from '../../../assets/img/logo.png'
import { CalendarOutlined, DashboardOutlined, ReadOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
export default function index() {

  return (
    <>
      <Header

        style={{
          padding: 20,
          background: "white",
          position: "sticky",
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="logo" className='img-fuild rounded-circle mx-2' style={{ width: '50px', }} /><h5 className='text-center'>Student Management System</h5>
      </Header>

      <div className='navbar'>
        <ul className="nav px-3">
          <li className="nav-item">
            <Link className="nav-link" aria-current="page" to="/"><i className="bi bi-speedometer2"></i></Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/students"><i className="bi bi-people"></i></Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/course"><i className="bi bi-book"></i></Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/attendance" ><i className="bi bi-calendar-check"></i></Link>
          </li>
        </ul>
      </div>

    </>
  )
}
