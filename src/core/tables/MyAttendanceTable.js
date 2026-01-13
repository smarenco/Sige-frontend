import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, message, Table, Tag, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { ACCESS_TOKEN } from '../common/consts';
import { API_URL } from '../../env';
import { attendanceUpdate } from '../services/AttendanceService';

export const MyAttendanceTable = ({ data: propAttendance, loading, uploadJustification: propUploadJustification }) => {
    const [attendance, setAttendance] = useState([]);

    const uploadJustification = (data) => {
        if (data.justification !== undefined) {
            propUploadJustification(data);
        }
    }

    const columns = [
        {
            title: 'Dia',
            dataIndex: 'day',
            key: 'day',
            width: 60
        },
        {
            title: 'Estado',
            dataIndex: 'state',
            key: 'state',
            width: 90,
            render: (state) => (
                <Tag color={state === 'Presente' ? 'green' : 'red'}>
                    {state}
                </Tag>
            ),
        },
        { title: 'Observación', dataIndex: 'observation', key: 'observation', ellipsis: true },
        {
            title: 'Acción',
            key: 'action',
            width: 80,
            render: (text, record) => {
                console.log(record);
                
                return (
                record.state == "Falta" && record.justification_id == null  ?
                    <Upload
                        onRemove={(file) => {
                            uploadJustification(undefined)
                        }}
                        beforeUpload={(justification) => {
                            uploadJustification({justification, student_id: record.student_id, day: record.day})
                            message.success(`Archivo ${justification.name} cargado correctamente`)
                            return false;
                        }
                        }
                        fileList={[]}
                        multilpe={false}
                    >
                        <Button icon={<PlusCircleOutlined />} />
                    </Upload>
                    :
                    (
                        record.state == "Falta" && record.justification_id !== null ?
                        <Button
                            type='default'
                            icon={<DownloadOutlined />}
                            onClick={() => downloadJustification(record?.justification_id)}
                        />
                        :
                        (
                            <span>N/A</span>
                        )
                    )
            )},
        },
    ];

    const downloadJustification = (justificationId) => {
        if (justificationId) {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const url = `${API_URL}/justification/${justificationId}?token=${token}`; // Reemplaza con la URL de tu archivo
            window.open(url, '_blank');
        }
    }

    useEffect(() => {
        let transformedAttendance = [];
        
        if (propAttendance.length > 0) {
            let student_id = propAttendance[0]['student_id'];

            transformedAttendance = Object.keys(propAttendance[0])
                .filter(key => key !== 'student_id' && key !== 'student_name')
                .map((day, index) => ({
                    key: `${day}-${index}`,
                    student_id,
                    day,
                    state: propAttendance[0][day].state ? 'Presente' : 'Falta',
                    observation: propAttendance[0][day]?.observation,
                    justification_id: propAttendance[0][day]?.justification_id,
                }));
        }

        setAttendance(transformedAttendance)
    }, [propAttendance]);

    return (
        <Table
            columns={columns}
            dataSource={attendance}
            loading={loading}
            scroll={{ x: '100%', y: '45vh' }}
            style={{
                height:'60vh'
            }}
        />
    )
}