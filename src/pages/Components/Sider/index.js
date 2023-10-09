
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
                    fontSize: '14px',

                }}
                items={[
                    {
                        label: 'Dashboard',
                        key: '/',
                        icon: <DashboardOutlined />,
                    },
                    {
                        label: 'Students',
                        key: '/students',
                        icon: <UsergroupAddOutlined />,
                    },
                    {
                        label: 'Course',
                        key: '/course',
                        icon: <ReadOutlined />,
                    },
                    {
                        label: 'Attendance',
                        key: '/attendance',
                        icon: <CalendarOutlined />,
                    },

                ]} />
        </div>
    )
}
