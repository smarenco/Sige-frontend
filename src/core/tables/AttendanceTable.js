import React, { useEffect, useState } from 'react'
import { DatePicker, Button, Table, Divider, Row, Col, Layout } from 'antd'
import { Header } from 'antd/es/layout/layout';
import { LeftCircleOutlined, PlusCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { AttendanceListModal } from '../modals/AttendanceListModal';
import { renderError } from '../common/functions';
import { attendanceCreate, attendanceIndex, attendanceUpdate } from '../services/AttendanceService';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import './AttendanceTable.css'
import { AttendanceItemModal } from '../modals/AttendanceItemModal';

dayjs.locale('es');

export const AttendanceTable = ({ students = [], confirmLoading, group: propGroup, modalMode = false }) => {
    const [modalAttendanceList, setModalAttendanceList] = useState(false);
    const [modalAttendanceItem, setModalAttendanceItem] = useState(false);
    const [loadingAttendance, setLoadingAttendance] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [attendanceMonth, setAttendanceMonth] = useState(dayjs());
    const [attendanceItem, setAttendanceItem] = useState({});
    const [isButtonClick, setIsButtonClick] = useState(false);
    const [group, setGroup] = useState(propGroup);

    const fetchAttendance = async ({ attendanceMonth, group_id }) => {
        try {
            setLoadingAttendance(true);
            const { data } = await attendanceIndex({ attendanceMonth, group_id });
            // console.log('page',data);

            setAttendance(data);
        } catch (err) {
            setLoadingAttendance(false);
            renderError(err);
        } finally {
            setLoadingAttendance(false)
        }
    };

    const attendanceColumns = () => {
        let cols = [{
            title: 'Estudiante',
            key: 'student_name',
            dataIndex: 'student_name',
            width: 100,
            ellipsis: true,
        }]

        for (let i = 1; i < 32; i++) {
            cols.push({
                title: i < 10 ? `0${i}` : i,
                key: `${i}`,  // Aseguramos que la llave sea un string
                dataIndex: `${i}`,  // Aseguramos que el dataIndex sea un string
                width: 20,
                style: { textAlign: 'center' },
                ellipsis: true,
                className: 'attendance-state',
                render: (r, t) => t[i] && renderAttendanceState({ ...t[i], day: i, id: t.student_id, name: t.student_name })
            })
        }
        // console.log(cols)
        return cols
    }

    const showAttendanceItem = ({ state, observation, justification_id, student_id, day, name }) => {
        setAttendanceItem({ state, observation, justification_id, student_id, day, name })
        setModalAttendanceItem(true)
    }

    const renderAttendanceState = (data) => {
        const { state, observation, justification_id, id: student_id, day, name } = data
        const text = state ? 'Asistió' : 'No Asistió'
        const type = state ? 'true' : 'false'

        if (state !== undefined) {
            return <div onClick={() => showAttendanceItem({ state, observation, justification_id, student_id, day, name })} className={`attendance-state attendance-state-${type}`}>{text}</div>
        }
        return ''
    }

    const onCancelModalAttendanceList = () => {
        setModalAttendanceList(false)
    }

    const onOkModalAttendanceList = async (attendanceList, attendance_date) => {
        setLoadingAttendance(true);
        try {
            if (attendanceList.id) {
                await attendanceUpdate(attendanceList.id, attendanceList);
            } else {
                await attendanceCreate({ attendanceList, group_id: group, attendance_date });
            }

            setModalAttendanceList(false);
            fetchAttendance({ attendanceMonth, group_id: group });
        } catch (err) {
            setLoadingAttendance(false)
            renderError(err);
        }
        setModalAttendanceList(false)
    }

    const onCancelModalAttendanceItem = (attendanceItem) => {
        setModalAttendanceItem(false)
        setAttendanceItem({})
    }

    const onOkModalAttendanceItem = async (attendanceItem) => {
        setLoadingAttendance(true);
        try {
            await attendanceUpdate({ attendanceMonth, group_id: group }, attendanceItem);

            setModalAttendanceItem(false); fetchAttendance({ attendanceMonth, group_id: group });
        } catch (err) {
            setLoadingAttendance(false)
            renderError(err);
        }
        setModalAttendanceItem(false)
    }

    const handleMonthChange = (newMonth, fromButton = false) => {
        setIsButtonClick(fromButton); // Indicamos si el cambio fue desde los botones
        setAttendanceMonth(newMonth);
    };

    useEffect(() => {
        if (group)
            fetchAttendance({ attendanceMonth, group_id: group })
    }, []);

    useEffect(() => {
        setGroup(propGroup)
    }, [propGroup]);

    useEffect(() => {
        if (isButtonClick) {
            fetchAttendance({ attendanceMonth, group_id: group })
            setIsButtonClick(false); // Reiniciamos el estado
        }
    }, [attendanceMonth]);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header style={{
                backgroundColor: 'white',
                paddingInline: 15,
                lineHeight: 0,
                flexShrink: 0
            }}>
                <Row>
                    <Col span={18}>
                        Mes de asistencia
                        <DatePicker
                            allowClear={false}
                            placeholder='Seleccione un mes'
                            style={{ marginLeft: 10, width: '200px' }}
                            disabled={confirmLoading || loadingAttendance}
                            picker="month"
                            format='MM/YYYY'
                            value={attendanceMonth}
                            onChange={setAttendanceMonth}
                        />
                        <Button disabled={confirmLoading || loadingAttendance || group == undefined} onClick={() => fetchAttendance({ attendanceMonth, group_id: group !== undefined ? group : undefined })} type='primary' style={{ marginLeft: 10 }}>Buscar</Button>
                    </Col>
                    <Col span={6}>
                        <Button disabled={group == undefined} icon={<PlusCircleOutlined />} type='primary' onClick={() => setModalAttendanceList(true)} style={{ float: 'right' }}>Pasar lista</Button>
                    </Col>
                </Row>
                <Divider style={{ margin: 15 }} />
                <Row>
                    <Col span={8}>
                        <Button onClick={() => handleMonthChange(attendanceMonth.subtract(1, 'month'), true)} disabled={confirmLoading || loadingAttendance || group == undefined} icon={<LeftCircleOutlined />}>Mes anterior</Button>
                    </Col>
                    <Col span={8}>
                        <h2 style={{ textAlign: 'center', textAlign: 'center' }}>{attendanceMonth.format('MMMM').charAt(0).toUpperCase() + attendanceMonth.format('MMMM').slice(1)}</h2>
                    </Col>
                    <Col span={8}>
                        <Button onClick={() => handleMonthChange(attendanceMonth.add(1, 'month'), true)} disabled={confirmLoading || loadingAttendance || group == undefined} icon={<RightCircleOutlined />} style={{ float: 'right' }}>Mes siguiente</Button>
                    </Col>
                </Row>
            </Header>
            <div style={{ padding: 15, overflow: 'auto', maxHeight: '60vh' }}>
                <Table
                    rowKey="student_id"
                    size="small"
                    style={{ paddingTop: modalMode ? 10 : 50 }}
                    columns={attendanceColumns()}
                    dataSource={attendance}
                    loading={confirmLoading || loadingAttendance}
                    pagination={false}
                    scroll={{ y: 450 }}
                />
            </div>
            <AttendanceListModal
                open={modalAttendanceList}
                loading={confirmLoading || loadingAttendance}
                students={students}
                onOk={onOkModalAttendanceList}
                onCancel={onCancelModalAttendanceList}
            />
            <AttendanceItemModal
                open={modalAttendanceItem}
                loading={confirmLoading || loadingAttendance}
                item={attendanceItem}
                onOk={onOkModalAttendanceItem}
                onCancel={onCancelModalAttendanceItem}
            />
        </div>
    )
}