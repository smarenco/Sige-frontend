import React, { useEffect, useState } from 'react'

import { DatePicker, Form, Input, InputNumber, Select, Switch, Tag } from 'antd'
import Loading from '../components/common/Loading'
import LayoutH from '../components/layout/LayoutH';
import { renderError } from '../common/functions';
import { userCombo } from '../services/UserService';
import { courseCombo } from '../services/CourseService';
import TextArea from 'antd/lib/input/TextArea';
import { paymentMethodsCombo } from '../services/PaymentMethodsService';
import { DDMMYYYY } from '../common/consts';
import dayjs from 'dayjs';
import Icon from '@ant-design/icons';

export const PaymentForm = ({ view, loading, confirmLoading, formState, onInputChange, onInputChangeByName, onInputChangeByObject }) => {    

    const [loadingMethodsPayment, setLoadingMethodsPayment ] = useState([]);
    const [methodsPayment, setMethodsPayment ] = useState([]);
    const [loadingStudents, setLoadingStudents ] = useState([]);
    const [students, setStudents ] = useState([]);
    const [loadingCourses, setLoadingCourses ] = useState([]);
    const [courses, setCourses ] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(0);
    const [searchUser, setSearchUser ] = useState([]);
    const [openSelectUser, setOpenSelectUser] = useState(false);

    useEffect(() => {
        // Reabre el menú cuando se actualicen los datos de `students` y `openSelectUser` es true
        if (students.length > 0 && openSelectUser) {
            setOpenSelectUser(true);
        }
    }, [students]);
    
    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            if(formState.student_id){
                const courses = await courseCombo({ student_id: formState.student_id });
                setCourses(courses);
            }else{
                setCourses([]);
            }
            setLoadingCourses(false);
        } catch(err) {
            setLoadingCourses(false);
            renderError(err);
        }
    };

    const fetchStudents = async (Search) => {
        setLoadingStudents(true);
        try {
            const students = await userCombo({ Search, User_type: 'student', State: 1});
            setStudents(students);
            setLoadingStudents(false);
        } catch(err) {
            setLoadingStudents(false);
            renderError(err);
        }
    };

    const fetchMethodsPayment = async () => {
        setLoadingMethodsPayment(true);
        try {
            const methodsPayment = await paymentMethodsCombo();
            setMethodsPayment(methodsPayment);
            setLoadingMethodsPayment(false);
        } catch(err) {
            setLoadingMethodsPayment(false);
            renderError(err);
        }
    };

    useEffect(() => {
        fetchMethodsPayment();
        fetchStudents();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [formState.student_id]);

    useEffect(() => {
        onInputChangeByObject(
            {
                apply_surcharge: false, 
                surcharge: undefined, 
                discount: undefined, 
            } 
        );
    }, [formState.apply_discount]);

    useEffect(() => {
        onInputChangeByName('surcharge', undefined);
    }, [formState.apply_surcharge]);

    useEffect(() => {
        let { surcharge, discount, amount_coute, value_cuote } = formState;
        surcharge = !isNaN(parseInt(surcharge)) ? parseInt(surcharge) : 0;
        discount = !isNaN(parseInt(discount)) ? parseInt(discount) : 0;
        amount_coute = !isNaN(parseInt(amount_coute)) ? parseInt(amount_coute) : 0;
        value_cuote = !isNaN(parseInt(value_cuote)) ? parseInt(value_cuote) : 0;
        
        let total = 0;
        total = amount_coute * value_cuote;
        total = total + surcharge - discount;

        onInputChangeByName('total', total);
    }, [formState.surcharge, formState.discount, formState.amount_coute, formState.value_cuote]);

    const onChangeCourse = (course_id) => {
        let course = courses.filter(course => course.id === course_id)[0];

        let fechaInicial = dayjs(formState.UltimaCuota);
        //console.log('fechaInicial '+ fechaInicial)
        let cuotes = []; 
        for(let i=1; i <= 6; i++){

            fechaInicial.add(1, 'M');
            let format = dayjs(fechaInicial).format(DDMMYYYY);
            cuotes.push({'format': format, 'date': dayjs(fechaInicial)});
        }

        onInputChangeByObject({course_id, value_cuote: course.quota_value, cuotes, amount_coute: 0});
    }

    const onChangeCuotes = (values) => {       
        onInputChangeByObject({cuotes: values, amount_coute: values.length});
    }

    return (
        loadingStudents || loadingCourses || loadingMethodsPayment ? <Loading /> : <Form layout='vertical'>
            <LayoutH>
                <div span={24}>
                    <LayoutH>
                        <Form.Item label={`${!view ? '*' : ''} Estudiante`} labelAlign='left' span={15}>
                            <Select
                                key={`${students.length}`}
                                showSearch
                                disabled={confirmLoading}
                                loading={loadingStudents}
                                value={formState.student_id}
                                open={openSelectUser}
                                onDropdownVisibleChange={visible => setOpenSelectUser(visible)}
                                onSearch={searchUser => {
                                    setSearchUser(searchUser);
                                    if (searchUser?.length > 2) {
                                        if (typingTimeout) {
                                            clearTimeout(typingTimeout);
                                        }
                                        setTypingTimeout(() => setTimeout(() => fetchStudents(searchUser), 1000));
                                    } else {
                                        onInputChangeByName('student_id', undefined);
                                    }
                                }}
                                notFoundContent={
                                    searchUser?.length > 2 && students.length === 0 && !loadingStudents
                                        ? <>No hay resultados</>
                                        : searchUser?.length > 2 && loadingStudents
                                            ? <>Buscando...</>
                                            : <><Icon type="search" /> Comience a escribir para buscar</>
                                }
                                onSelect={student_id => onInputChangeByName('student_id', student_id)}
                            >
                                {students.map(student => 
                                    <Select.Option value={student.id} key={student.id}>
                                        {`${student.names} ${student.lastnames} - ${student.document}`}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Metodo de pago`} labelAlign='left' span={9}>
                            <Select 
                                allowClear
                                showSearch
                                disabled={view || confirmLoading || loadingMethodsPayment}
                                loading={loadingMethodsPayment}
                                value={formState.payment_method_id}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={payment_method_id => onInputChangeByName('payment_method_id', payment_method_id)}
                                > 
                                    {methodsPayment.map(methodPayment => 
                                        <Select.Option value={methodPayment.id} key={methodPayment.id}>{methodPayment.name}</Select.Option>
                                        )}
                                </Select>
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Curso`} labelAlign='left' span={15}>
                            <Select 
                                allowClear
                                showSearch
                                disabled={view || confirmLoading || loadingCourses || courses.length === 0}
                                loading={loadingCourses}
                                value={formState.course_id}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={onChangeCourse}
                                > 
                                    {courses.map(course => 
                                        <Select.Option value={course.id} key={course.id}>{course.name}</Select.Option>
                                        )}
                                </Select>
                        </Form.Item>
                        <Form.Item label='Referencia' labelAlign='left' span={9}>
                            <Input name='reference' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.reference} />
                        </Form.Item>
                    </LayoutH>
                    <LayoutH>
                        <Form.Item label='Cuotas' labelAlign='left' span={24}>
                            {formState.cuotes.map(cuote => <Tag>{dayjs(cuote.cuote).format(DDMMYYYY)}</Tag>)}
                        </Form.Item>
                        <Form.Item label='Aplica descuento' labelAlign='left' span={8}>
                            <Switch name='apply_discount' disabled={view || confirmLoading} onChange={(apply_discount) => onInputChangeByName('apply_discount', apply_discount)} checked={formState?.apply_discount} />
                        </Form.Item>
                        <Form.Item label='Aplica recargo' labelAlign='left' span={8}>
                            <Switch name='apply_surcharge' disabled={view || confirmLoading || formState?.apply_discount} onChange={(apply_surcharge) => onInputChangeByName('apply_surcharge', apply_surcharge)} checked={formState?.apply_surcharge} />
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Fecha de pago`} labelAlign='left' span={22}>
                            <DatePicker disabled={view} name='date' onChange={(date) => onInputChangeByName('date', dayjs(date))} format={DDMMYYYY} value={formState?.date ? dayjs(formState?.date)  : undefined}/>
                        </Form.Item>
                    </LayoutH>
                    <LayoutH>
                        <Form.Item label='Descuento' labelAlign='left' span={8}>
                            <InputNumber min={0} style={{borderColor: 'green'}} name='discount' disabled={view || confirmLoading || !formState?.apply_discount} onChange={(discount) => onInputChangeByName('discount', discount)} value={formState?.discount} />
                        </Form.Item>
                        <Form.Item label='Recargo' labelAlign='left' span={8}>
                            <InputNumber min={0} style={{borderColor: 'red'}} name='surcharge' disabled={view || confirmLoading || formState?.apply_discount || !formState?.apply_surcharge} onChange={(surcharge) => onInputChangeByName('surcharge', surcharge)} value={formState?.surcharge} />
                        </Form.Item>
                        <Form.Item label='Valor Couta' labelAlign='left' span={6}>
                            <InputNumber min={0} name='value_cuote' disabled={view || confirmLoading} onChange={(value_cuote) => onInputChangeByName('value_cuote', value_cuote)} value={formState?.value_cuote} />
                        </Form.Item>
                        <Form.Item label='Observacion' labelAlign='left' span={22}>
                            <TextArea name='observation' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.observation} />
                        </Form.Item>
                    </LayoutH>
                </div>
                <div span={24} style={{textAlign: 'right'}}>
                    <h2 style={{marginRight: 40}}>Total  ${formState.total}</h2>
                    {formState.canceled && <h3 style={{padding: 10, textAlign: 'center', backgroundColor: !formState.canceled && '#ffc7c7'}}>Cancelado el {dayjs(formState?.canceled_date).format(DDMMYYYY)} por {formState?.user_canceled?.names +' '+ formState?.user_canceled?.lastnames}</h3>}
                </div>
            </LayoutH>
        </Form>
    )
}