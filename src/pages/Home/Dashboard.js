
import React, {useState } from 'react'
import { Content } from 'antd/es/layout/layout';
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useCourseContext } from 'contexts/CourseContext';
import { CChart } from '@coreui/react-chartjs';
import { useStudentContext } from 'contexts/StudentContext';

export default function Dashboard() {
  const { dbCourses } = useCourseContext()
  const {dbStudents} = useStudentContext()
  const [totalActiveCourse, setTotalActiveCourse] = useState("")
  const [totalStudents, setTotalStudents] = useState("")
  const [totalCoursesName, setTotalCoursesName] = useState([])
  const [joinStudentCourses, setJoinStudentCourses] = useState([])
  setTimeout(()=>{
    const activeCourses = dbCourses.filter(course => {
      return course.courseStatus === 'active'
    })
    
    setTotalActiveCourse(activeCourses.length)

    const allCourses = dbCourses.map((course)=>{
      return course.courseName
    })
    setTotalCoursesName(allCourses)
    setTotalStudents(dbStudents.length)
    const arr = [];
    totalCoursesName.map((c,i)=>{
      const stu = dbStudents.filter((student)=>{
        return student.studentCourse === c
      })
      arr.push(stu.length)
    })
    setJoinStudentCourses(arr)
  },100)
  return (
    <>

      <Content className='p-3'>
        <Row gutter={16} className='mb-3'>
          <Col span={12}>
            <Card bordered={true} style={{fontSize:'24px'}}>
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
                valueStyle={{ color: '#65A7FF' }}
                prefix={<i className="bi bi-book"></i>}
              />
            </Card>
          </Col>
        </Row>
        <Row>
           <Col lg={{span:20,offset:2}} sm={{span:20,offset:2}}>
           <CChart
              type="bar"
              height={150}
              data={{
                labels: totalCoursesName,
                datasets: [
                  {
                    label: 'Join Student',
                    backgroundColor: '#62BC47',
                    data: joinStudentCourses,
                  },
                ],
              }}
              labels="months"
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color:'black'
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {

                    },
                    ticks: {

                    },
                  },
                  y: {
                    grid: {

                    },
                    ticks: {
                      color:'black'
                    },
                  },
                },
              }}
            />
           </Col>
        </Row>
      </Content>
    </>
  )
}
