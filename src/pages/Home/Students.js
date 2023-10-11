import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Empty, Form, Row, Space, message } from 'antd'
import Search from 'antd/es/input/Search'
import { firestore } from 'config/firebase';
import { useCourseContext } from 'contexts/CourseContext';
import { useStudentContext } from 'contexts/StudentContext';

import { addDoc, collection, deleteDoc, doc, updateDoc, } from 'firebase/firestore';
import React, { useState } from 'react';
const initState = { studentName: '', studentId: '', studentCourse: '', studentEmail: '', studentPhoneNo: '', studentHomeAdd: '' }

export default function Students() {
    const { dbCourses } = useCourseContext()
    const { dbStudents, setDbStudents } = useStudentContext()
    const [form] = Form.useForm();
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const [search, setSearch] = useState("")
    const [state, setState] = useState(initState);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [editStudent, setEditStudent] = useState({});
    const [lastStudentCourse, setLastStudentCourse] = useState('');

    const showDrawer = () => {
        setOpen(true);

    };
    const onClose = () => {
        setOpen(false);
    };
    const onCloseUpdate = () => {
        setOpenUpdate(false);
    };
    const handleChange = e => {
        setState(s => ({ ...s, [e.target.name]: e.target.value }))
    }
    const handleSubmit = async () => {
        const { studentName, studentId, studentCourse, studentEmail, studentPhoneNo, studentHomeAdd } = state
        const studentData = {
            id: '',
            studentName,
            studentId,
            studentCourse,
            studentEmail,
            studentPhoneNo,
            studentHomeAdd,
            createdAt: new Date(),
            lastStudentCourse: '',
            modifiedAt: '',
        }
        if (studentData.studentName === "") {
            message.warning("Please enter student name")
            return;
        }
        if (studentData.studentId === "") {
            message.warning("Please enter student id")
            return;
        }
        if (studentData.studentCourse === "") {
            message.warning("Please select student course ")
            return;
        }
        if (studentData.studentEmail === "") {
            message.warning("Please enter student email")
            return;
        }
        if (studentData.studentEmail === "") {
            message.warning("Please enter student phone no")
            return;
        }
        if (studentData.studentHomeAdd === "") {
            message.warning("Please enter student home address")
            return;
        }
        setSubmitLoading(true)
        try {
            const docRefAdd = await addDoc(collection(firestore, "students"), studentData);
            // Update the timestamp field with the value from the server
            const docRef = doc(firestore, 'students', docRefAdd.id);
            await updateDoc(docRef, {
                id: docRef.id
            });
            message.success('Student added successfully');
            setSubmitLoading(false)
            studentData['id'] = docRefAdd.id
            const arr = dbStudents
            arr.push(studentData)
            setDbStudents(arr)
            setState(initState)
        } catch (error) {
            setSubmitLoading(false)
            console.log(error)
        }

    }
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, "students", id));
            const afterDeleteStudent = dbStudents.filter((student) => {
                return student.id !== id
            })
            setDbStudents(afterDeleteStudent)
            message.success("Student Deleted Successfully")
        } catch (e) {
            console.log(e.error)
        }
    }
    // Edit Student Function
    const handleEditChange = e => {
        setEditStudent(s => ({ ...s, [e.target.name]: e.target.value }))
    }
    const handleEdit = async (id) => {
        setOpenUpdate(true)
        const getStudentData = dbStudents.find((student) => {
            return student.id === id;
        })
        setLastStudentCourse(getStudentData.studentCourse)
        setEditStudent(getStudentData)
    }
    // Update Student Function
    const handleUpdate = async () => {
        const { id, studentName, studentId, studentCourse, studentEmail, studentPhoneNo, studentHomeAdd, createdAt } = editStudent
        const studentUpdateData = {
            id,
            studentName,
            studentId,
            studentCourse,
            studentEmail,
            studentPhoneNo,
            studentHomeAdd,
            createdAt,
            studentLastCourse: lastStudentCourse,
            modifiedAt: new Date(),
        }
        if (studentUpdateData.studentCourse === "") {
            message.warning("Please select student course ")
            return;
        }
        if (studentUpdateData.studentEmail === "") {
            message.warning("Please enter student email")
            return;
        }
        if (studentUpdateData.studentEmail === "") {
            message.warning("Please enter student phone no")
            return;
        }
        if (studentUpdateData.studentHomeAdd === "") {
            message.warning("Please enter student home address")
            return;
        }
        setSubmitLoading(true)

        const docRef = doc(firestore, 'students', studentUpdateData.id);
        await updateDoc(docRef, studentUpdateData);

        const updateStudentData = dbStudents.filter((student) => {
            return student.id !== studentUpdateData.id
        })
        updateStudentData.push(studentUpdateData)
        setDbStudents(updateStudentData)
        setSubmitLoading(false)
        setOpenUpdate(false)
        message.success("Student Update Successfully");
    }
    return (
        <div className='student-main'>
            <div className="top-side">
                <div className="search">
                    <Search
                        placeholder="Search students via name or id"
                        onChange={(e) => setSearch(e.target.value.toLowerCase().trim())}
                        style={{
                            width: 300,
                        }}
                    />
                </div>
                <div className="add py-1">
                    <Button type="primary" size='middle' onClick={showDrawer} icon={<i className="bi bi-person-plus"></i>}>
                        Add New Student
                    </Button>
                </div>
            </div>
            <div className="main-side">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Student Name</th>
                                <th scope="col">Student ID</th>
                                <th scope="col">Student Course</th>
                                <th scope="col" className='no-show-sm'>Student Email</th>
                                <th scope="col" className='no-show-sm'>Student Phone No#</th>
                                <th scope="col" className='no-show-sm'>Student Address</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {

                                dbStudents.filter((student) => {
                                    return search === ''
                                        ? student
                                        : student.studentName.toLowerCase().includes(search) ||
                                        student.studentId.toLowerCase().includes(search)
                                }).map((student, i) => {

                                    return (
                                        <tr key={i}>
                                            <th scope="row">{i + 1}</th>
                                            <td>{student.studentName}</td>
                                            <td>{student.studentId}</td>
                                            <td>{student.studentCourse}</td>
                                            <td className='no-show-sm'>{student.studentEmail}</td>
                                            <td className='no-show-sm'>{student.studentPhoneNo}</td>
                                            <td className='no-show-sm'>{student.studentHomeAdd}</td>
                                            <td>
                                                <Space>
                                                    <Button type="dashed" icon={<DeleteOutlined />} onClick={() => handleDelete(student.id)} danger />
                                                    <Button type="dashed" onClick={() => handleEdit(student.id)} icon={<EditOutlined />} />
                                                </Space>
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
            <Drawer
                title="Add a new student"
                width={620}
                onClose={onClose}
                open={open}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button style={{ backgroundColor: '#62BC47' }} onClick={handleSubmit} type="primary" loading={isSubmitLoading}>
                            Submit
                        </Button>
                    </Space>
                }
            >
                <form layout="vertical"

                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b>Student Name </label>
                            <input type='text' className='form-control mb-3' name="studentName" value={state.studentName} onChange={handleChange} placeholder="Enter student name" />

                        </Col>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b>Student ID</label>
                            <input type='tel' className='form-control mb-3' name='studentId' value={state.studentId} onChange={handleChange} placeholder="Example 3310000000000" />

                        </Col>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b>Student Course </label>
                            <select className='form-select mb-3' name="studentCourse" value={state.studentCourse} onChange={handleChange} placeholder="Ehoose the course">
                                {
                                    dbCourses.filter((course) => {
                                        return course.courseStatus === 'active'
                                    }).map((course, i) => {
                                        return <option key={i} value={course.courseName}>{course.courseName}</option>

                                    })

                                }
                            </select>
                        </Col>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b>Student Email Address</label>
                            <input type='email' className='form-control mb-3' name='studentEmail' value={state.studentEmail} onChange={handleChange} placeholder="Enter student email address" />

                        </Col>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b>Student Phone Number </label>
                            <input type='tel' className='form-control mb-3' name='studentPhoneNo' value={state.studentPhoneNo} onChange={handleChange} placeholder="Example 9230000000" pattern="[0-9]{12}" required />

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b>Student Postal Address </label>
                            <textarea className='form-control mb-3' rows={4} value={state.studentHomeAdd} name='studentHomeAdd' onChange={handleChange} placeholder="Enter student postal address" />
                        </Col>
                    </Row>

                </form>
            </Drawer>
            {/* Update Student Drawer */}
            <Drawer
                title="Update student"
                width={620}
                onClose={onCloseUpdate}
                open={openUpdate}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={onCloseUpdate}>Cancel</Button>
                        <Button style={{ backgroundColor: '#62BC47' }} onClick={handleUpdate} type="primary" loading={isSubmitLoading}>
                            Update
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical"
                    form={form}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <label>Student Name</label>
                            <input type="text" className='form-control mb-3' value={editStudent.studentName} disabled />
                        </Col>
                        <Col span={12}>
                            <label>Student Id</label>
                            <input type="text" className='form-control mb-3' value={editStudent.studentId} disabled />
                        </Col>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b> Student Course</label>
                            <select name="studentCourse" className='form-select mb-3' onChange={handleEditChange}>
                                <option disabled>Select student course</option>
                                {
                                    dbCourses.map((course, i) => {
                                        return <option key={i} value={course.courseName} >{course.courseName}</option>
                                    })
                                }
                            </select>
                        </Col>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b> Student Email</label>
                            <input type="email" className='form-control mb-3' name='studentEmail' onChange={handleEditChange} value={editStudent.studentEmail} />
                        </Col>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b> Student Phone No</label>
                            <input type="text" className='form-control mb-3' name='studentPhoneNo' onChange={handleEditChange} value={editStudent.studentPhoneNo} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b> Student Postal Address</label>
                            <textarea type="text" className='form-control mb-3' onChange={handleEditChange} value={editStudent.studentHomeAdd} />
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    )
}
