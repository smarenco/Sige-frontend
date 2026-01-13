import { useState } from 'react';
import { Button, Card, Col, DatePicker, Dropdown, Modal, Row, Select } from 'antd'
import { alertError, renderError } from '../../../common/functions';
import { user } from '../../../services/AuthService';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { attendanceIndex, attendanceUpdate } from '../../../services/AttendanceService';
import { MyAttendanceTable } from '../../../tables/MyAttendanceTable';
import { groupCombo } from '../../../services/GroupService';

export const MyAttendancePage = ({ app, isMobile }) => {
    const [attendance, setAttendance] = useState([]);
    const [dataPage, setDataPage] = useState({ page: 1, pageSize: 50 });
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [attendanceMonth, setAttendanceMonth] = useState(dayjs());

    const renderExtraTable = () => {
        return (
            <Row justify='space-between'>
                <Col span={isMobile ? 24 : 5} style={{ margin: '15px 15px 15px 0px' }}>
                    <span span={24}>Mes de asistencia</span>
                </Col>
                <Col span={isMobile ? 24 : 6}>
                    <DatePicker
                        allowClear={false}
                        placeholder='Seleccione un mes'
                        style={{ width: isMobile ? '100%' : '150px', marginRight: 25, marginBottom: 10, marginTop: 10 }}
                        disabled={loading}
                        picker="month"
                        format='MM/YYYY'
                        value={attendanceMonth}
                        onChange={setAttendanceMonth}
                        />
                </Col>
                <Col span={isMobile ? 24 : 6}>
                    <Select
                        allowClear
                        value={group}
                        disabled={loading}
                        onChange={setGroup}
                        style={{ marginRight: 10, width: isMobile ? '100%' : '150px', marginBottom: 10, marginTop: 10 }}
                        placeholder='Grupos'
                    >
                        {groups.map(group =>
                            <Select.Option value={group.id} key={group.id}>{group.name}</Select.Option>
                        )}
                    </Select>
                </Col>
                <Col span={isMobile ? 24 : 4}>
                    <Button type='primary' disabled={group === undefined} style={{ margin: 10, float: 'right' }} onClick={loadData}>Buscar</Button>
                </Col>
            </Row>
        );
    }

    const uploadJustification = async ({ justification, day }) => {
        setLoading(true);
        let student = user()
        try {
            await attendanceUpdate({ attendanceMonth, group_id: group, student_id: student.id }, {
                day,
                group_id: group,
                justification,
                student_id: student.id,
                observation: "Justificacion cargada por estudiante"
            });
            loadData();
        } catch (err) {
            setLoading(false)
            renderError(err);
        }
    }

    const onPageChange = async (page, pageSize) => {
        pageSize = pageSize === undefined ? pageSize : pageSize;
        setDataPage({ ...dataPage, pageSize, page });
        setLoading(true);

        try {
            const { data } = await attendanceIndex({ attendanceMonth, group_id: group, student_id: user().id });
            setAttendance(data);
            setLoading(false);
        } catch (err) {
            alertError(err);
            setLoading(false);
        }
    }

    const loadGroups = async () => {
        setLoading(true)
        let student = user()
        const respGroups = await groupCombo({ user_type: student.type, user_id: student.id });
        setLoading(false)
        setGroups(respGroups)
    }

    const loadData = () => {
        onPageChange(1);
    }

    useEffect(() => {
        loadGroups();
    }, []);

    return (
        <>
            <Card
                title={(<strong>Mi asistencia</strong>)}
                className='ant-section'
                extra={renderExtraTable()}
            >
                <MyAttendanceTable
                    loading={loading}
                    data={attendance}
                    uploadJustification={uploadJustification}
                />
            </Card>
        </>
    )
}
