import React, { useEffect, useState } from 'react'

import { Form, Input, Select, DatePicker, Tabs, Button, InputNumber } from 'antd'
import Loading from '../components/common/Loading'
import LayoutH from '../components/layout/LayoutH';
import { userCombo } from '../services/UserService';
import { alertError, renderError } from '../common/functions';
import { courseCombo } from '../services/CourseService';
import { turnCombo } from '../services/TurnService';
import { GroupStudentTable } from '../tables/GroupStudentTable';
import { GroupTeacherTable } from '../tables/GroupTeacherTable';
import { DDMMYYYY } from '../common/consts';
import { instituteCombo } from '../services/InstituteService';
import { DocumentCategoryDocumentTable } from '../tables/DocumentCategoryDocumentTable';
import { documentCategoryShow } from '../services/DocumentCategoryService';
import dayjs from 'dayjs';
import { AttendanceTable } from '../tables/AttendanceTable';
import Icon from '@ant-design/icons';
const { TextArea } = Input;

export const GroupForm = ({ view, loading, confirmLoading, formState, onInputChange, onInputChangeByName }) => {
    let [institutes, setInstitutes] = useState([]);
    let [loadingInstitutes, setLoadingInstitutes] = useState(false);

    const [courses, setCourses] = useState([]);
    let [loadingCourses, setLoadingCourses] = useState(false);

    const [turns, setTurns] = useState([]);
    let [loadingTurns, setLoadingTurns] = useState(false);

    let [students, setStudents] = useState([]);
    let [loadingStudents, setLoadingStudents] = useState(false);
    let [userStudentSelected, setUserStudentSelected] = useState(undefined);
    const [typingTimeoutStudent, setTypingTimeoutStudent] = useState(0);
    const [searchStudent, setSearchStudent ] = useState([]);
    const [openSelectStudent, setOpenSelectStudent] = useState(false);

    let [teachers, setTeachers] = useState([]);
    let [loadingTeachers, setLoadingTeachers] = useState(false);
    let [userTeacherSelected, setUserTeacherSelected] = useState(undefined);

    let [documents, setDocuments] = useState([]);
    let [loadingDocuments, setLoadingDocuments] = useState(false);

    useEffect(() => {
        // Reabre el menú cuando se actualicen los datos de `students` y `openSelectStudent` es true
        if (students.length > 0 && openSelectStudent) {
            setOpenSelectStudent(true);
        }
    }, [students]);

    const fetchStudents = async (Search) => {
        setLoadingStudents(true);
        try {
            const students = await userCombo({ Search, User_type: 'student', State: 1 });
            setStudents(students);
            setLoadingStudents(false);
        } catch (err) {
            setLoadingStudents(false);
            renderError(err);
        }
    };

    const fetchTeachers = async () => {
        setLoadingTeachers(true);
        try {
            const teachers = await userCombo({ User_type: 'teacher', State: 1 });
            setTeachers(teachers);
            setLoadingTeachers(false);
        } catch (err) {
            setLoadingTeachers(false);
            renderError(err);
        }
    };

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const courses = await courseCombo();
            if (formState.course_id) {
                const documental_category_id = courses.filter(course => course.id === formState.course_id)[0]?.documental_category_id;
                fetchDocumentsCategoryDocuments(documental_category_id);
            }
            setCourses(courses); setLoadingCourses(false);
        } catch (err) {
            setLoadingCourses(false);
            renderError(err);
        }
    };

    const fetchTurns = async () => {
        setLoadingTurns(true);
        try {
            const turns = await turnCombo();
            setTurns(turns); setLoadingTurns(false);
        } catch (err) {
            setLoadingTurns(false);
            renderError(err);
        }
    };

    const fetchInstitutes = async () => {
        setLoadingInstitutes(true);
        try {
            const institutes = await instituteCombo();
            setInstitutes(institutes);
            setLoadingInstitutes(false);
        } catch (err) {
            setLoadingInstitutes(false);
            renderError(err);
        }
    };

    const addStudent = () => {
        if (!userStudentSelected) {
            alertError('Debe seleccionar un estudiante');
            return;
        }

        let formStateStudents = formState.students;
        const studentExists = formStateStudents.filter(student => student.id === userStudentSelected);

        if (studentExists.length > 0) {
            alertError('Estudiante ya agregado');
            return false;
        }

        if (formState.students.length === parseInt(formState.number_students)) {
            alertError('Se alcanzó el límite de cupos de estudiante');
            return false;
        }

        formStateStudents.push(students.filter(student => student.id === userStudentSelected)[0]);
        onInputChangeByName('students', formStateStudents);
        setUserStudentSelected(undefined);
    }

    const deleteStudent = (idStudent) => {
        let formStateStudents = formState.students.filter(student => student.id !== idStudent);
        onInputChangeByName('students', formStateStudents);
    }

    const addTeacher = () => {
        if (!userTeacherSelected) {
            alertError('Debe seleccionar un profesor');
            return;
        }

        let formStateTeachers = formState.teachers;
        const teacherExists = formStateTeachers.filter(teacher => teacher.id === userTeacherSelected);

        if (teacherExists.length > 0) {
            alertError('Profesor ya agregado');
            return false;
        }

        formStateTeachers.push(teachers.filter(teacher => teacher.id === userTeacherSelected)[0]);
        onInputChangeByName('teachers', formStateTeachers);
    }

    const deleteTeacher = (idTeacher) => {
        let formStateTeachers = formState.teachers.filter(teacher => teacher.id !== idTeacher);
        onInputChangeByName('teachers', formStateTeachers);
    }

    const onChangeCourse = (course_id) => {
        onInputChangeByName('course_id', course_id);
        if (course_id) {
            const documental_category_id = courses.filter(course => course.id === course_id)[0]?.documental_category_id;
            fetchDocumentsCategoryDocuments(documental_category_id);
        } else {
            setDocuments([]);
        }

    }

    const fetchDocumentsCategoryDocuments = async (documental_category_id) => {
        setLoadingDocuments(true);
        try {
            if (documental_category_id) {
                const documentCategory = await documentCategoryShow(documental_category_id);
                setDocuments(documentCategory.documental_category_document);
            } else {
                setDocuments([]);
            }

            setLoadingDocuments(false);
        } catch (err) {
            setLoadingDocuments(false);
            renderError(err);
        }
    };

    useEffect(() => {
        //fetchStudents();
        fetchTeachers();
        fetchTurns();
        fetchCourses();
        fetchInstitutes();
    }, []);

    const items = [
        {
            label: 'Datos Basicos',
            key: 'info_basic',
            children:
                <LayoutH>
                    <Form.Item label={`${!view ? '*' : ''} Nombre`} labelAlign='left' span={10}>
                        <Input name='name' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.name} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Turno`} labelAlign='left' span={6}>
                        <Select
                            allowClear
                            showSearch
                            name='turn_id'
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading || loadingTurns}
                            loading={loadingTurns}
                            onChange={(turn_id) => onInputChangeByName('turn_id', turn_id)}
                            value={formState?.turn_id}
                        >
                            {turns.map(turn =>
                                <Select.Option value={turn.id} key={turn.id}>{turn.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Curso`} labelAlign='left' span={8}>
                        <Select
                            allowClear
                            showSearch
                            name='course_id'
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading || loadingCourses}
                            loading={loadingCourses}
                            onChange={onChangeCourse}
                            value={formState?.course_id}
                        >
                            {courses.map(course =>
                                <Select.Option value={course.id} key={course.id}>{course.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Instituto`} labelAlign='left' span={6}>
                        <Select
                            allowClear
                            showSearch
                            name='institute_id'
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading || loadingInstitutes}
                            loading={loadingInstitutes}
                            onChange={(institute_id) => onInputChangeByName('institute_id', institute_id)}
                            value={formState?.institute_id}
                        >
                            {institutes.map(institute =>
                                <Select.Option value={institute.id} key={institute.id}>{institute.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Cupos`} labelAlign='left' span={5}>
                        <InputNumber name='number_students' min={formState.students.length} disabled={view || confirmLoading} onChange={(number_students) => onInputChangeByName('number_students', number_students)} value={formState?.number_students} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Desde`} labelAlign='left' span={5}>
                        <DatePicker name='start_date' disabled={view || confirmLoading} onChange={(start_date) => onInputChangeByName('start_date', start_date)} format={DDMMYYYY} value={formState?.start_date ? dayjs(formState?.start_date) : undefined} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Hasta`} labelAlign='left' span={5}>
                        <DatePicker name='finish_date' disabled={view || confirmLoading} onChange={(finish_date) => onInputChangeByName('finish_date', finish_date)} format={DDMMYYYY} value={formState?.finish_date ? dayjs(formState?.finish_date) : undefined} />
                    </Form.Item>
                    <Form.Item label={`Descripcion`} labelAlign='left' span={24}>
                        <TextArea name='description' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.description} />
                    </Form.Item>
                </LayoutH>
        }, {
            label: 'Alumnos',
            key: 'info_students',
            children:
                <>
                    <LayoutH>
                        <Form.Item label={`Alumno`} labelAlign='left' span={12}>
                            <Select
                                key={`${students.length}`}
                                allowClear
                                showSearch
                                name='Alumno'
                                disabled={confirmLoading}
                                loading={loadingStudents}
                                open={openSelectStudent}
                                value={userStudentSelected}
                                onDropdownVisibleChange={visible => setOpenSelectStudent(visible)}
                                onSearch={searchUserStudent => {
                                    setSearchStudent(searchUserStudent);
                                    if (searchUserStudent?.length > 2) {
                                        if (typingTimeoutStudent) {
                                            clearTimeout(typingTimeoutStudent);
                                        }
                                        setTypingTimeoutStudent(() => setTimeout(() => fetchStudents(searchUserStudent), 1000));
                                    } else {
                                        setUserStudentSelected(undefined);
                                    }
                                }}
                                notFoundContent={
                                    searchStudent?.length > 2 && students.length === 0 && !loadingStudents
                                        ? <>No hay resultados</>
                                        : searchStudent?.length > 2 && loadingStudents
                                            ? <>Buscando...</>
                                            : <><Icon type="search" /> Comience a escribir para buscar</>
                                }
                                onSelect={userStudentSelected => setUserStudentSelected(userStudentSelected)}
                            >
                                {students.map(student => 
                                    <Select.Option value={student.id} key={student.id}>
                                        {`${student.names} ${student.lastnames} - ${student.document}`}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Button style={{ marginTop: 30 }} type='primary' onClick={addStudent}>Agregar Estudiante</Button>
                    </LayoutH>
                    <GroupStudentTable
                        data={formState.students}
                        onDeleteStudent={deleteStudent}
                    />
                </>
        }, {
            label: 'Profesores',
            key: 'info_teachers',
            children:
                <>
                    <LayoutH>
                        <Form.Item label={`Profesor`} labelAlign='left' span={12}>
                        <Select
                                allowClear
                                showSearch
                                disabled={view || confirmLoading || loadingTeachers}
                                loading={loadingTeachers}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={userTeacherSelected => setUserTeacherSelected(userTeacherSelected)}
                            >
                                {teachers.map(teacher =>
                                    <Select.Option key={teacher.id} value={teacher.id}>{teacher.names + " " + teacher.lastnames}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Button style={{ marginTop: 30 }} type='primary' onClick={addTeacher}>Agregar Profesor</Button>
                    </LayoutH>
                    <GroupTeacherTable
                        data={formState.teachers}
                        onDeleteTeacher={deleteTeacher}
                    />
                </>
        }, {
            label: 'Documentos',
            key: 'info_documents',
            children:
                <DocumentCategoryDocumentTable
                    data={documents}
                    view={true}
                />
        }, {
            label: 'Asistencia',
            key: 'attendance',
            children:
                <AttendanceTable
                    loadingCourses={loadingCourses}
                    confirmLoading={confirmLoading}
                    students={formState.students}
                    group={formState.id}
                    modalMode={true}
                />
        }
    ];

    return (
        loading || loadingTurns || loadingCourses || loadingInstitutes || loadingDocuments ? <Loading /> : <Form layout='vertical'>
            <Tabs
                style={{ marginTop: -15 }}
                size='small'
                items={items}
            />
        </Form>
    )
}