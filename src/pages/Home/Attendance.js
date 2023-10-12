import { useCourseContext } from 'contexts/CourseContext'
import React, { useState } from 'react'
import Search from 'antd/es/input/Search'
import { Button, Empty, Space, message } from 'antd'
import { useStudentContext } from 'contexts/StudentContext'
import dayjs from 'dayjs'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { firestore } from 'config/firebase'
import { useAttendanceContext } from 'contexts/AttendanceContext'
export default function Attendance() {
  const { dbCourses } = useCourseContext()
  const { dbStudents } = useStudentContext()
  const {dbAttendance, setDbAttendance} = useAttendanceContext()
  const [searchCourse, setSearchCourse] = useState('')
  const [search, setSearch] = useState('')

  // Attendance Function
  const handleAttendance = async (e, id) => {
    const todayAttendance = dbAttendance.filter((att)=>{
      return att.createdAt === dayjs(new Date()).format('DD-MM-YYYY') && att.studentId === id
    })
    const status = e.target.value
    const attendanceStudent = {
      id:'',
      studentId: id,
      status,
      createdAt: dayjs(new Date()).format('DD-MM-YYYY')
    }
    if(status==='')
    {
      message.error("Please select today status")
      return;
    }
    
    if(todayAttendance.length === 0 )
    {
      const docRefAdd = await addDoc(collection(firestore, "attendance"), attendanceStudent);
      // Update the id field with the value
      const attIdUpdate = doc(firestore, 'attendance', docRefAdd.id);
      await updateDoc(attIdUpdate, {
        id: attIdUpdate.id,
      });
      attendanceStudent['id'] = docRefAdd.id
      const  arr = dbAttendance
      arr.push(attendanceStudent)
      setDbAttendance(arr)
      message.success("Attendace Added Successfully")
      return;
    }
    else
    {
    const attUpdate = doc(firestore, 'attendance', todayAttendance[0].id);
    await updateDoc(attUpdate, {
      status:attendanceStudent.status,
      createdAt:attendanceStudent.createdAt
    });
    message.success("Attendace Update Successfully")
    return;
    }
  }
  return (
    <div className='attendance-main'>
      <div className="top-bar">
        <div className="student-search-course">
          <select className='form-select' value={dbAttendance.status} onChange={(e) => { setSearchCourse(e.target.value.toLowerCase().trim()) }}>
            <option selected value=''>Select course for attendance</option>
            {
              dbCourses.filter((course) => {
                return course.courseStatus === 'active'
              }).map((course) => {
                return <option value={course.courseName}>{course.courseName}</option>
              })
            }
          </select>
        </div>
        <div>
          <h5>OR</h5>
        </div>
        <div className="student-search-id">
          <Search
            size='large'
            placeholder="Search students via Id"
            onChange={(e) => setSearch(e.target.value.toLowerCase().trim())}
            style={{
              width: 300,
            }}
          />
        </div>
      </div>
      <div className="main-content py-3">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr className='text-center'>
                <th scope="col">#</th>
                <th scope="col">Student Name</th>
                <th scope="col">Student ID</th>
                <th scope="col">Student Course</th>
                <th scope="col">Attendance</th>
                <th scope="col">Action</th>

              </tr>
            </thead>
            <tbody>
              {

                dbStudents.filter((student) => {
                  return search === ''
                    ? student
                    : student.studentId.toLowerCase().includes(search)
                }).filter((student) => {
                  return searchCourse === ''
                    ? student
                    : student.studentCourse.toLowerCase().includes(searchCourse)
                }).map((student, i) => {

                  return (
                    <tr key={i} className='text-center'>
                      <th scope="row">{i + 1}</th>
                      <td>{student.studentName}</td>
                      <td>{student.studentId}</td>
                      <td>{student.studentCourse}</td>
                      <td>
                        {
                        dbAttendance.filter((att)=>{
                          return att.studentId === student.id && att.createdAt === dayjs(new Date()).format('DD-MM-YYYY')
                        }).map((att)=>{
                         return <Space>
                            {att.status === 'present'? <span className='bg-success p-2 rounded text-light fw-bold'>P</span> : att.status==="absent"? <span className='bg-danger p-2 rounded text-light fw-bold'>A</span>: att.status === "leave"?<span className='bg-warning p-2 rounded text-light fw-bold'>L</span> : <span>No Mark Attendance</span>  }
                        </Space>
                        })
                        
                        }
                      </td>
                      <td>
                        <select className='form-select' onChange={(e) => handleAttendance(e, student.id)}>
                          <option disabled selected>Select</option>
                          <option value='present'>Present</option>
                          <option value='absent'>Absent</option>
                          <option value='leave'>Leave</option>
                        </select>
                      </td>
                      
                    </tr>)

                })
              }

            </tbody>
          </table>
          {
            dbStudents.length === 0 ?

              <div className='text-center'>
                <Empty />
              </div>
              :
              <>
              </>
          }
        </div>
      </div>
    </div>
  )
}
