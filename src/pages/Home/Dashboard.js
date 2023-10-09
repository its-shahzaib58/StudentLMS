
import React, { useEffect, useState } from 'react'
import { Content } from 'antd/es/layout/layout';
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { collection, getDocs, query } from 'firebase/firestore';

import { firestore } from 'config/firebase';
import { useCourseContext } from 'contexts/CourseContext';

export default function Dashboard() {
  const {dbCourses} = useCourseContext()
  const [totalActiveCourse,setTotalActiveCourse] = useState("")
  const [totalStudents,setTotalStudents] = useState("")
  const getCourse = () => {
    const activeCourses = dbCourses.filter(course=>{
      return course.courseStatus == 'active'
    })
    setTotalActiveCourse(activeCourses.length)
}
const getStudents = async () => {
  const q  = query(collection(firestore, "students"))
    const querySnapshot = await getDocs(q);
  const coursesArray = []
  querySnapshot.forEach((doc) => {
      coursesArray.push(doc.data())

    
  });
  const totalStudents = coursesArray.length;
  setTotalStudents(totalStudents)
}
useEffect(()=>{
  getCourse()
  getStudents()
},[])
  return (
    <>

      <Content className='px-3 '>
        <Row gutter={16}>
          <Col span={12}>
          <Card bordered={true}>
              <Statistic
                title="Total Students"
                value={totalStudents}
                precision={0}
                valueStyle={{ color: '#65A7FF' }}
                prefix={<UserOutlined />}
                
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={true}>
              <Statistic
                title="Total Active Courses"
                value={totalActiveCourse}
                precision={0}
                valueStyle={{ color: '#65A7FF'}}
                prefix={<i className="bi bi-book"></i>}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </>
  )
}
