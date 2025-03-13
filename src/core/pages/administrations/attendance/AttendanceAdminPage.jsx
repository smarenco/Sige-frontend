import { Button, Card, Dropdown, Form, Modal, Select, Tabs } from 'antd'
import { useState } from 'react';
import { alertError, renderError } from '../../../common/functions';
import { user } from '../../../services/AuthService';
import { FileExcelOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { AttendanceTable } from '../../../tables/AttendanceTable';
import TabPane from 'antd/es/tabs/TabPane';
import { courseIndex } from '../../../services/CourseService';
import { groupIndex } from '../../../services/GroupService';

export const AttendanceAdminPage = ({ app }) => {
    const [loading, setLoading] = useState(false);
    const [group, setGroup] = useState(undefined);
    const [groups, setGroups] = useState([]);
    const [course, setCourse] = useState(undefined);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    
    const renderCourseOptions = (data) => {        
        return data.map((item, i) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>);
    }
    
    const renderGroupOptions = (data) => {
        return data.map((item, i) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>);
    }

    const loadCourses = async () => {
        setLoading(true);

        try {
            const { data } = await courseIndex();
            setCourses(data); setLoading(false);
        } catch (err) {
            alertError(err);
            setLoading(false);
        }
    }

    const loadGroups = async () => {
        setLoading(true);

        try {
            const { data } = await groupIndex();
            setGroups(data); setLoading(false);
        } catch (err) {
            alertError(err);
            setLoading(false);
        }
    }

    const handleOnCourseChange = (value) => {
        setCourse(value)
        if(value == undefined){
            setGroup(undefined)
            setGroups([])
        }
    }

    const handleOnGroupChange = (value) => {
        let auxGroup = groups.find(x => x.id == value)
        setGroup(auxGroup)
        if(auxGroup)
            //console.log(auxGroup);
            
            setStudents(auxGroup.students)
    }

    useEffect(()=>{
        loadCourses()
    },[]);
    
    useEffect(()=>{
        if(course)
            loadGroups()
    },[course]);

    const items = [
        {
            label: 'Asistencia',
            key: 'attendance',
            children:
                <>
                    <div style={{ width: '100%', paddingInline: 15, paddingBottom: 10 }}>
                        Curso <Select
                            allowClear
                            loading={loading}
                            disabled={loading}
                            placeholder={'Seleccione un curso'}
                            onChange={handleOnCourseChange}
                            value={course}
                            style={{ marginInline: 10 }}
                        >
                            {renderCourseOptions(courses)}
                        </Select>
                        Grupo <Select
                            allowClear
                            loading={loading}
                            disabled={loading || course == null}
                            placeholder={'Seleccione un grupo'}
                            onChange={handleOnGroupChange}
                            value={group?.id}
                            style={{ marginLeft: 10 }}
                        >
                            {renderGroupOptions(groups)}
                        </Select>
                    </div>
                    <AttendanceTable
                        confirmLoading={loading}
                        students={students}
                        group={group?.id}
                    />
                </>
        }
    ]

    return (
        <>
            <Card
                title={(<strong>Administración de asistencia</strong>)}
                className='ant-section'
                style={{
                    height: '100%'
                }}
            >
                <Tabs
                    tabBarStyle={{ paddingLeft: 15 }}
                    items={items} />
            </Card>
        </>
    )
}
