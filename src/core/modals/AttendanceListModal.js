import { Modal } from 'antd'
// import { renderError } from '../common/functions';
import { AttendanceListForm } from '../forms/AttendanceListForm';
import { useAttendanceList } from '../hooks/useAttendanceList';
import { useEffect, useState } from 'react';
import { renderError } from '../common/functions';
import dayjs from 'dayjs';

export const AttendanceListModal = (props) => {
    const { students, open, onOk: onOkProp, loading, onCancel: onCancelProp } = props;
    const {
        setStudents,
        students: hookStudents,
        restoreAttendanceObservationData,
        onChangeAttendanceData,
        setModalAttendanceObservationItem,
        modalAttendanceObservationItem,
        setModalAttendanceObservationAuxItem,
        setJustificationFileList,
        justificationFileList,
    } = useAttendanceList()

    const [fecha, setFecha] = useState(dayjs())

    const onOk = () => {
        const studentWithoutState = hookStudents.find(student => student?.state === undefined)
        if (studentWithoutState !== undefined) {
            renderError('Debe asignar un Estado a todos los estudiantes');
            return;
        }

        onOkProp(hookStudents, fecha);
    }

    const onCancel = () => {
        onCancelProp(hookStudents);
    }

    useEffect(() => {
        // console.log(students);
        
        setStudents(students.map(r => ({ id: r.id, names: r.names, lastnames: r.lastnames, state: undefined, attendance_observation: undefined, justification: undefined })))
    }, [students]);

    useEffect(() => {
    }, [hookStudents])

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            title='Lista Asistencia'
            style={{ paddingTop: 10 }}
        >
            <AttendanceListForm
                loading={loading}
                setStudents={setStudents}
                restoreAttendanceObservationData={restoreAttendanceObservationData}
                onChangeAttendanceData={onChangeAttendanceData}
                setModalAttendanceObservationItem={setModalAttendanceObservationItem}
                modalAttendanceObservationItem={modalAttendanceObservationItem}
                setModalAttendanceObservationAuxItem={setModalAttendanceObservationAuxItem}
                setJustificationFileList={setJustificationFileList}
                justificationFileList={justificationFileList}
                formStudents={hookStudents}
                setFecha={setFecha}
                fecha={fecha}
            />
        </Modal>
    );
}
