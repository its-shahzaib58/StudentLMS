import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, message } from 'antd'
import Search from 'antd/es/input/Search'
import { firestore } from 'config/firebase';
import CourseContextProvider, { useCourseContext } from 'contexts/CourseContext';

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
const { Option } = Select;
const initState = { studentName: '', studentId: '', studentEmail: '', studentPhoneNo: '', studentHomeAdd: '' }

export default function Students() {
    const {dbCourses, setDbCourses} = useCourseContext()
    const [form] = Form.useForm();
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const [state, setState] = useState(initState);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentCourse, setStudentCourse] = useState('');
    const [editStudent, setEditStudent] = useState({});

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
    
    const getStudents = async () => {
        const querySnapshot = await getDocs(collection(firestore, "students"));
        const studentArray = []
        querySnapshot.forEach((doc) => {
            studentArray.push(doc.data())

            setStudents(studentArray)
        });
    }
    const handleSubmit = async () => {
        const { studentName, studentId, studentEmail, studentPhoneNo, studentHomeAdd } = state
        const studentData = {
            id: '',
            studentName,
            studentId,
            studentCourse,
            studentEmail,
            studentPhoneNo,
            studentHomeAdd,
            createdAt: new Date(),
        }
        console.log(studentData)
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
            getStudents()
            setSubmitLoading(false)
            form.resetFields();
        } catch (error) {
            setSubmitLoading(false)
            console.log(error)
        }

    }
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, "students", id));
            message.success("Student deleted successfully")
            getStudents()
        } catch (e) {
            console.log(e.error)
        }
    }
    const handleEdit = async(id) => {
        setOpenUpdate(true)
        const q = query(collection(firestore, "students"), where("id", "==", id));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
           setEditStudent(doc.data())
        });
        console.log(editStudent.studentName)
    }
    const handleUpdate = () => {

    }
    useEffect(() => {
        getStudents()
    
    }, [])
    return (
        <div className='student-main'>
            <div className="top-side">
                <div className="search">
                    <Search
                        placeholder="Search students"

                        style={{
                            width: 300,
                        }}
                    />
                </div>
                <div className="add">
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
                                <th scope="col">Student Email</th>
                                <th scope="col">Student Phone No#</th>
                                <th scope="col">Student Address</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                students === "" ?
                                    <th className='text-center'>No Data Found</th>
                                    :
                                    students.map((students, i) => {
                                        return (
                                            <tr key={i}>
                                                <th scope="row">{i + 1}</th>
                                                <td>{students.studentName}</td>
                                                <td>{students.studentId}</td>
                                                <td>{students.studentCourse}</td>
                                                <td>{students.studentEmail}</td>
                                                <td>{students.studentPhoneNo}</td>
                                                <td>{students.studentHomeAdd}</td>
                                                <td>
                                                    <Space>
                                                        <Button type="dashed"  icon={<DeleteOutlined />} onClick={() => handleDelete(students.id)} danger />
                                                        <Button  type="dashed" onClick={() => handleEdit(students.id)}  icon={<EditOutlined />} />
                                                    </Space>
                                                </td>
                                            </tr>)

                                    })
                            }

                        </tbody>
                    </table>
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
                <Form layout="vertical"
                    form={form}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="Student Name"
                                label="Student Name"
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                            >
                                <Input name="studentName" value={state.studentName} onChange={handleChange} placeholder="Please enter student name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="Student Id"
                                label="Student ID"
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                            >
                                <Input name='studentId' value={state.studentId} onChange={handleChange} placeholder="Please enter student id" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="Student Course"
                                label="Student Course"
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                            >
                                <Select name="studentCourse" onChange={(value) => { setStudentCourse(value) }} placeholder="Please choose the student course">
                                    {
                                        dbCourses.map((course, i) => {
                                            return <Option key={i} value={course.courseId}>{course.courseName}</Option>

                                        })

                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="Student Email Address"
                                label="Student Email Address"
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                            >
                                <Input name='studentEmail' value={state.studentId} onChange={handleChange} placeholder="Please enter student email address" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="Student Phone Number"
                                label="Student Phone Number"
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                            >
                                <Input name='studentPhoneNo' value={state.studentId} onChange={handleChange} placeholder="Please enter student phone number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="Student Home Address"
                                label="Student Home Address"
                                rules={[
                                    {
                                        required: true,

                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} value={state.courseDes} name='studentHomeAdd' onChange={handleChange} placeholder="Please enter student home address" />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Drawer>
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
                            <label>Student Name*</label>
                           <input type="text" className='form-control mb-3' value={editStudent.studentName} />
                        </Col>
                        <Col span={12}>
                        <label>Student Id*</label>
                           <input type="text" className='form-control mb-3' value={editStudent.studentId} />
                        </Col>
                        <Col span={24}>
                            <label>Student Course*</label>
                            <select name="student" className='form-control mb-3'>
                                <option selected disabled>Select student course</option>
                                {
                                    dbCourses.map((course,i)=>{
                                        return <option key={i} value={course.courseId} >{course.courseName}</option>
                                    })
                                }
                            </select>
                        </Col>
                        <Col span={12}>
                            <label>Student Email*</label>
                           <input type="email" className='form-control mb-3' value={editStudent.studentEmail} />
                        </Col>
                        <Col span={12}>
                        <label>Student Phone No*</label>
                           <input type="text" className='form-control mb-3' value={editStudent.studentPhoneNo} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <label>Student Home Address*</label>
                           <textarea type="text" className='form-control mb-3' value={editStudent.studentHomeAdd} />
                        </Col>
                    </Row>

                </Form>
            </Drawer>
        </div>
    )
}
