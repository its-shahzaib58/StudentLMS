
import {  Divider,  Menu,  Typography, } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined, DashboardOutlined,  ReadOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const initialState = { listName: '', };
export default function Sider() {
    const navigate = useNavigate();


    return (
        <div className=' p-2'>
            <div>
                <Divider style={{ fontSize: 24 }}>
                    Dashboard
                </Divider>
            </div>
            <Typography.Title level={5}>
                Menu's
            </Typography.Title>
            
            <Menu className='bg-light'
                onClick={({ key }) => {
                    navigate(key)
                }}
                style={{
                    fontSize: '15px',

                }}
                items={[
                    {
                        label: 'Dashboard',
                        key: '/',
                        icon: <i className="bi bi-speedometer2"></i>,
                    },
                    {
                        label: 'Students',
                        key: '/students',
                        icon: <i className="bi bi-people"></i>,
                    },
                    {
                        label: 'Course',
                        key: '/course',
                        icon:<i className="bi bi-book"></i>,
                    },
                    {
                        label: 'Attendance',
                        key: '/attendance',
                        icon: <i className="bi bi-calendar-check"></i>,
                    },

                ]} />
        </div>
    )
}
