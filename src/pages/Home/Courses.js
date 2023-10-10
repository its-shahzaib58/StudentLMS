import { DeleteOutlined, EditOutlined, LoadingOutlined} from '@ant-design/icons'
import { Button, Col, Drawer, Empty, Form, Modal, Popconfirm, Row, Space, Tooltip, message } from 'antd'
import Search from 'antd/es/input/Search'
import { firestore } from 'config/firebase';
import { useCourseContext } from 'contexts/CourseContext';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
const initState = { courseName: '', courseId: '', courseDes: '', courseStatus: '' }

export default function Courses() {
    const { dbCourses, setDbCourses } = useCourseContext();
    const [form] = Form.useForm();
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const [state, setState] = useState(initState);
    const [editState, setEditState] = useState(initState);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [isOpenEditModal, setOpenEditModal] = useState(false)

    const handleEditModalClose = () => {
        setOpenEditModal(false)
    }
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const handleChange = e => {
        setState(s => ({ ...s, [e.target.name]: e.target.value }))
    }
    const handleEditChange = e => {
        setEditState(s => ({ ...s, [e.target.name]: e.target.value }))
    }
    // Edit Course Function
    const handleEditCourse = id => {
        setOpenEditModal(true)
        const getEditCourse = dbCourses.filter((course) => {
            return course.id === id
        })
        getEditCourse.map((course)=> {
           return setEditState(course)
        })
    }
    // Update Course Function
    const handleUpdateCourse = async () => {
        const { id, courseName, courseId, courseStatus, courseDes, createdAt } = editState
        if (courseName === "") {
            message.warning("Please enter course name")
            return;
        }
        if (courseStatus === "") {
            message.warning("Please select course status")
            return;
        }
        if (courseDes === "") {
            message.warning("Please enter course description")
            return;
        }
        setSubmitLoading(true)
        const updateCourse = {
            id,
            courseName,
            courseId,
            courseStatus,
            courseDes,
            createdAt,
            modifiedAt: new Date(),
        }
        const docRef = doc(firestore, 'courses', editState.id);
        await updateDoc(docRef, updateCourse);
        
        const editCourse = dbCourses.filter((course) => {
            return course.id !== editState.id
        })
        editCourse.push(updateCourse)
        setDbCourses(editCourse)
        setSubmitLoading(false)
        setOpenEditModal(false)
        message.success("Course updated successfully")
    }
    // Delete Course Function
    const handleDelete = async (id) => {

        try {
            await deleteDoc(doc(firestore, "courses", id));
            const afterDeleteCourse = dbCourses.filter((course) => {
                return course.id !== id
            })
            console.log(afterDeleteCourse)
            setDbCourses(afterDeleteCourse)
            message.success("Course deleted successfully")

        } catch (e) {
            console.log(e.error)
        }
    }
    const handleSubmit = async () => {

        const { courseName, courseId, courseDes, courseStatus } = state
        var courseData = {
            id: '',
            courseName,
            courseId,
            courseStatus,
            courseDes,
            createdAt: new Date(),
        }

        if (courseData.courseName === "") {
            message.warning("Please enter course name")
            return;
        }
        if (courseData.courseId === "") {
            message.warning("Please enter course id")
            return;
        }
        if (courseData.courseStatus === "") {
            message.warning("Please select course status")
            return;
        }
        if (courseData.courseDes === "") {
            message.warning("Please enter course description")
            return;
        }
        setSubmitLoading(true)
        try {
            const docRefAdd = await addDoc(collection(firestore, "courses"), courseData);
            // Update the timestamp field with the value from the server
            const docRef = doc(firestore, 'courses', docRefAdd.id);
            console.log(docRef)
            await updateDoc(docRef, {
                id: docRef.id
            });
            message.success('Course added successfully');
            setSubmitLoading(false)
            courseData['id'] = docRefAdd.id
            const arr = dbCourses;
            arr.push(courseData)
            setDbCourses(arr)
            setState(initState)
        } catch (error) {
            setSubmitLoading(false)
            console.log(error)
        }

    }

    return (
        <div className='course-main'>
            <div className="top-side">
                <div className="search">
                    <Search
                        placeholder="Search course via name or id"
                        onChange={(e) => setSearch(e.target.value.toLowerCase().trim())}
                        style={{
                            width: 300,
                        }}
                    />
                </div>
                <div className="add py-1">
                    <Button type="primary" onClick={showDrawer} size='middle' icon={<i className="bi bi-clipboard2-plus"></i>}>
                        Add New Course
                    </Button>
                </div>
            </div>
            <div className="main-side">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Course Name</th>
                                <th scope="col">Course ID</th>
                                <th scope="col">Course Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                dbCourses.filter((course) => {
                                    return search === ''
                                        ? course
                                        : course.courseName.toLowerCase().includes(search) ||
                                        course.courseId.toLowerCase().includes(search)
                                }).map((course, i) => {
                                    return (
                                        <tr key={i}>
                                            <th scope="row">{i + 1}</th>
                                            <td>{course.courseName}</td>
                                            <td>{course.courseId}</td>
                                            <td>{course.courseDes}</td>
                                            <td style={{ fontSize: '14px', textAlign: 'center' }}>{course.courseStatus === "active" ? <Tooltip title="Active"> <i className="bi bi-check-circle text-success"></i> </Tooltip> : <Tooltip title="Unactive"> <i className="bi bi-x-circle text-danger"></i> </Tooltip>}</td>
                                            <td>
                                                <Space>
                                                    <Popconfirm
                                                        title="Delete the course"
                                                        description="Are you sure to delete this course"
                                                        onConfirm={() => handleDelete(course.id)}

                                                        okText="Yes"

                                                    >
                                                        <Button type="dashed" icon={<DeleteOutlined />} danger />
                                                    </Popconfirm>
                                                    <Button type="dashed" onClick={() => { handleEditCourse(course.id) }} icon={<EditOutlined />} />
                                                </Space>

                                            </td>
                                        </tr>)

                                })
                            }
                        </tbody>
                    </table>

                    {
                        dbCourses.length === 0 ?

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
                title="Add a new course"
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
                            <label><b className='text-danger'>*</b>Course Name </label>
                            <input className='form-control mb-4' name="courseName" value={state.courseName} onChange={handleChange} placeholder="Please enter course name" />

                        </Col>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b>Course Code </label>
                            <input className='form-control mb-4' name='courseId' value={state.courseId} onChange={handleChange} placeholder="Please enter course id" />
                        </Col>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b>Course Status </label>
                            <select className='form-control mb-4' name="courseStatus" onChange={handleChange} placeholder="Please choose the course status">
                                <option selected disabled>Select course status</option>
                                <option value="active">Active</option>
                                <option value="unactive">Unactive</option>
                            </select>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b>Course Description </label>
                            <textarea className='form-control mb-4' rows={4} value={state.courseDes} name='courseDes' onChange={handleChange} placeholder="Please enter course description" />

                        </Col>
                    </Row>

                </Form>
            </Drawer>
            {/* Edit Course Modal */}
            <Modal title="Edit Course" open={isOpenEditModal} onOk={handleUpdateCourse} onCancel={handleEditModalClose} okText={isSubmitLoading === true ? <LoadingOutlined /> : "Update"}>
                <Form layout="vertical"
                    form={form}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b>Course Name </label>
                            <input className='form-control mb-4' name="courseName" value={editState.courseName} onChange={handleEditChange} placeholder="Please enter course name" />

                        </Col>
                        <Col span={12}>
                            <label><b className='text-danger'>*</b>Course Code </label>
                            <input className='form-control mb-4' name='courseId' value={editState.courseId} onChange={handleEditChange} disabled />
                        </Col>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b>Course Status </label>
                            <select className='form-control mb-4' value={editState.courseStatus} name="courseStatus" onChange={handleEditChange} placeholder="Please choose the course status">
                                <option value="active">Active</option>
                                <option value="unactive">Unactive</option>
                            </select>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <label><b className='text-danger'>*</b>Course Description </label>
                            <textarea className='form-control mb-4' rows={4} value={editState.courseDes} name='courseDes' onChange={handleEditChange} placeholder="Please enter course description" />

                        </Col>
                    </Row>

                </Form>
            </Modal>
        </div>
    )
}
