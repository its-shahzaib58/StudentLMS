
import React, { useState } from 'react'
import { Content } from 'antd/es/layout/layout';
import { Card, Col, Divider, Row, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useCourseContext } from 'contexts/CourseContext';
import { CChart } from '@coreui/react-chartjs';
import { useStudentContext } from 'contexts/StudentContext';
import { useAttendanceContext } from 'contexts/AttendanceContext';
import dayjs from 'dayjs';

export default function Dashboard() {
  const { dbCourses } = useCourseContext()
  const { dbStudents } = useStudentContext()
  const {dbAttendance} = useAttendanceContext()
  const [totalActiveCourse, setTotalActiveCourse] = useState("")
  const [totalStudents, setTotalStudents] = useState("")
  const [todayPrensent, setTodayPresent] = useState(0)
  const [todayAbsent, setTodayAbsent] = useState(0)
  const [todayLeave, setTodayLeave] = useState(0)
  const [todayNoMark, setTodayNoMark] = useState(0)
  const [totalCoursesName, setTotalCoursesName] = useState([])
  const [joinStudentCourses, setJoinStudentCourses] = useState([])
  setTimeout(() => {
    // Backend of Join Student Chart
    const activeCourses = dbCourses.filter(course => {
      return course.courseStatus === 'active'
    })

    setTotalActiveCourse(activeCourses.length)

    const allCourses = dbCourses.map((course) => {
      return course.courseName
    })
    setTotalCoursesName(allCourses)
    setTotalStudents(dbStudents.length)
    const arr = [];
    totalCoursesName.map((c, i) => {
      const stu = dbStudents.filter((student) => {
        return student.studentCourse === c
      })
      arr.push(stu.length)
    })
    setJoinStudentCourses(arr)
    // Backend of Attendance Chart
    // Total Present Students
    const todayPrensentStatus = dbAttendance.filter((status)=>{
      return status.createdAt === dayjs(new Date()).format('DD-MM-YYYY') && status.status === 'present'
    }).map((status)=>{
      return status.status
    }).length;

    setTodayPresent(todayPrensentStatus)
    // Total Absent Students
    const todayAbsentStatus = dbAttendance.filter((status)=>{
      return status.createdAt === dayjs(new Date()).format('DD-MM-YYYY') && status.status === 'absent'
    }).map((status)=>{
      return status.status
    }).length ;
    setTodayAbsent(todayAbsentStatus)
    // Total Leave Students
    const todayLeaveStatus = dbAttendance.filter((status)=>{
      return status.createdAt === dayjs(new Date()).format('DD-MM-YYYY') && status.status === 'leave'
    }).map((status)=>{
      return status.status
    }).length;
    setTodayLeave(todayLeaveStatus)
    // Total No Mark Attendance 
    var totalStudents = dbStudents.length - todayPrensentStatus-todayAbsentStatus-todayLeaveStatus;
    console.log(totalStudents/100*100)

    totalStudents = totalStudents/dbStudents.length*100
    setTodayNoMark(totalStudents)
  }, 100)
  return (
    <>

      <Content className='p-3'>
        <Row gutter={16} className='mb-3'>
          <Col span={12}>
            <Card bordered={true} style={{ fontSize: '24px' }}>
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
          <Col lg={{ span: 15, offset: 0 }} sm={{ span: 20, offset: 2 }}>
          <Divider>Join Students Graph</Divider>
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
                      color: 'black'
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
                      color: 'black'
                    },
                  },
                },
              }}
            />
          </Col>
          <Col lg={{ span: 8, offset: 1 }} sm={{ span: 20, offset: 2 }}>
                <Divider>Today Students Attendance Chart</Divider>
            <CChart
              className='studentAttChart'
              type="doughnut"
              customTooltips={true}
              data={{
                labels: ['Present', 'Absent', 'Leave','No Mark Attendance'],
                datasets: [
                  {
                    backgroundColor: ['#62BC47', '#DC3545','#FFC107','#6C757D'],
                    data: [Math.round(todayPrensent/dbStudents.length*100), Math.round(todayAbsent/dbStudents.length*100), Math.round(todayLeave/dbStudents.length*100), Math.round(todayNoMark)],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: 'black',
                    }
                  }
                },
              }}
            />
          </Col>
        </Row>
      </Content>
    </>
  )
}
