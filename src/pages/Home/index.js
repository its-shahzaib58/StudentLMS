
import {Col, Row} from 'antd';
import {Route, Routes, } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
// Components
import Sider from '../Components/Sider';
import Header from '../Components/Header';
import Dashboard from '../Home/Dashboard'
import Students from './Students';
import Courses from './Courses';
import Attendance from './Attendance';

export default function Home() {
  return (
    <div className="main-app">
     <Row 
     style={{
      height:'100vh',
      padding:10,
    }}
     >
      {/* Sider */}
      <Col  className='sidebar'
        style={{
          borderRadius:'20px',
          alignItems:'center',
          padding:5,
        
        }}
        >
        <Sider/>

        </Col>
        <Col className='content bg-white px-2'>
          {/* Header */}
          <Row className='bg-white border-shadows' 
          style={{
            borderRadius:'20px',
            
          }}
          >
            <Header />
          </Row>
          <Row className='mt-2 border-shadows scroll-hide'
          style={{
            height:'80vh',
            borderRadius:'20px',
            padding:10,
          }}
          >
          <Content>
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/students' element={<Students/>}/>
            <Route path='/course' element={<Courses/>}/>
            <Route path='/attendance' element={<Attendance/>}/>
            
          </Routes>
          </Content>
          </Row>
        </Col>
     </Row>
    </div>
  )
}
