import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Switch } from 'antd'
import { useState, useEffect } from 'react';
import Payment from '../../models/Payment';

import { paymentCreate } from '../../services/PaymentService';
import dayjs from 'dayjs';
import { DDMMYYYY } from '../../common/consts';
import { courseCombo } from '../../services/CourseService';
import { userCombo } from '../../services/UserService';
import { paymentMethodsCombo } from '../../services/PaymentMethodsService';
import { useForm } from '../../hooks/useForm';
import { renderError } from '../../common/functions';
import LayoutH from '../../components/layout/LayoutH';
import TextArea from 'antd/es/input/TextArea';
import Icon from '@ant-design/icons';

export const PaymentPage = ({ app }) => {

    const [formState, setFormState] = useState(new Payment);    
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loadingMethodsPayment, setLoadingMethodsPayment ] = useState(false);
    const [methodsPayment, setMethodsPayment ] = useState([]);
    const [loadingStudents, setLoadingStudents ] = useState(false);
    const [students, setStudents ] = useState([]);
    const [loadingCourses, setLoadingCourses ] = useState(false);
    const [courses, setCourses ] = useState([]);
    const [cuotess, setCuotes ] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(0);
    const [searchUser, setSearchUser ] = useState([]);
    const [openSelectUser, setOpenSelectUser] = useState(false);

    useEffect(() => {
        // Reabre el menú cuando se actualicen los datos de `students` y `openSelectUser` es true
        if (students.length > 0 && openSelectUser) {
            setOpenSelectUser(true);
        }
    }, [students]);

    const onOk = async() => {
        
        if(!formState.student_id || formState.student_id.length === 0){
            renderError('Debe ingresar el estudiante');
            return;
        }

        if(!formState.course_id || formState.course_id.length === 0){
            renderError('Debe ingresar el curso');
            return;
        }

        if(!formState.payment_method_id || formState.payment_method_id.length === 0){
            renderError('Debe ingresar el metodo de pago');
            return;
        }

        if(!formState.date || formState.date.length === 0){
            renderError('Debe ingresar una fecha de pago');
            return;
        }

        let error = false;
        let fechaInicial = dayjs(formState.cuotes[0]);
        let cuotes = [];
        let formStateCuotes = [ ...formState.cuotes];
        let fechaComparacion = '';

        for(let i=0; i < formStateCuotes.length; i++){
            if(i === 0){
                let primerMes = cuotess[0];
                //console.log(primerMes.date+ ' !== ' +formStateCuotes[i])
                if(primerMes.date !== formStateCuotes[i]){
                    error = true;
                    renderError('Debe seleccionar el primer mes');
                    break;
                }
            }else{
                fechaComparacion = fechaInicial.add(1, 'M');
                //console.log(dayjs(fechaComparacion).format(DDMMYYYY)+ ' !== ' +dayjs(formStateCuotes[i]).format(DDMMYYYY))
                if(dayjs(fechaComparacion).format(DDMMYYYY) !== dayjs(formStateCuotes[i]).format(DDMMYYYY)){
                    error = true;
                    renderError('Las coutas deben ser consecutivas');
                    break;
                }
            }
            cuotes.push(dayjs(formStateCuotes[i]));
        }

        if(!error){
            setConfirmLoading(true);
            try {
                await paymentCreate(formState);
                setFormState(new Payment);
                setCuotes([])
            } catch(err) {
                renderError(err);
            }

            setConfirmLoading(false);
        }
    }

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
        //fetchStudents();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [formState.student_id]);

    useEffect(() => {
        setFormState({
            ...formState, 
            apply_surcharge: false, 
            surcharge: undefined, 
            discount: undefined, 
        });
    }, [formState.apply_discount]);

    useEffect(() => {
        setFormState({...formState, surcharge: undefined });
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

        setFormState({...formState, total});
    }, [formState.surcharge, formState.discount, formState.amount_coute, formState.value_cuote]);

    const onChangeCourse = (course_id) =>{
        let course = {}, cuotes = [];
        if(course_id){
            course = courses.filter(course => course.id === course_id)[0];

            let fechaInicial = undefined;
            
            if(course?.cuotes.length > 0){//SI YA PAGO ALGUNA CUOTA LA FECHA INICIAL SALE DE AHI, SINO LA SACO DELA FECHA DESDE DEL GRUPO
                fechaInicial = dayjs(course?.cuotes[course?.cuotes.length -1].cuote);
            }else{
                fechaInicial = dayjs(course?.group.start_date);
                fechaInicial = fechaInicial.add(-1, 'M');
            }
            for(let i=1; i <= 6; i++){

                fechaInicial = fechaInicial.add(1, 'M');
                let format = dayjs(fechaInicial).format(DDMMYYYY);
                cuotes.push({'format': format, 'date': dayjs(fechaInicial)});
            }
        }
        setFormState({...formState, course_id, value_cuote: course?.quota_value, cuotes: [], amount_coute: 0});
        setCuotes(cuotes);
    }
    
    const onChangeCuotes = (values) => {       
        setFormState({...formState, cuotes: values, amount_coute: values.length});
    }

    return (
        <Form layout='vertical'>
            <LayoutH>
                <div span={24}>
                    <LayoutH>
                        <Form.Item label={`Estudiante *`} labelAlign='left' span={15}>
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
                                        setFormState({ ...formState, student_id: undefined });
                                    }
                                }}
                                notFoundContent={
                                    searchUser?.length > 2 && students.length === 0 && !loadingStudents
                                        ? <>No hay resultados</>
                                        : searchUser?.length > 2 && loadingStudents
                                            ? <>Buscando...</>
                                            : <><Icon type="search" /> Comience a escribir para buscar</>
                                }
                                onSelect={student_id => setFormState({ ...formState, student_id })}
                            >
                                {students.map(student => 
                                    <Select.Option value={student.id} key={student.id}>
                                        {`${student.names} ${student.lastnames} - ${student.document}`}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item label={`Metodo de pago *`} labelAlign='left' span={9}>
                            <Select 
                                allowClear
                                showSearch
                                disabled={confirmLoading || loadingMethodsPayment}
                                loading={loadingMethodsPayment}
                                value={formState.payment_method_id}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={payment_method_id => setFormState({...formState, payment_method_id})}
                                > 
                                    {methodsPayment.map(methodPayment => 
                                        <Select.Option value={methodPayment.id} key={methodPayment.id}>{methodPayment.name}</Select.Option>
                                        )}
                                </Select>
                        </Form.Item>
                        <Form.Item label={`Curso *`} labelAlign='left' span={15}>
                            <Select 
                                allowClear
                                showSearch
                                disabled={confirmLoading || loadingCourses || courses.length === 0}
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
                            <Input name='reference' disabled={confirmLoading} onChange={(e) => setFormState({...formState, reference: e.target.value})} value={formState?.reference} />
                        </Form.Item>
                    </LayoutH>
                    <LayoutH>
                        <div span={24} style={{
                                overflowY: 'auto',
                                marginBottom: 10,
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                borderStyle: cuotess.length ? 'dashed' : 'solid',
                                borderRadius: 2,
                                padding: '6px 10px',
                                background: 'rgba(0, 0, 0, 0.025)',
                            }}> 
                                <Form.Item label={`* Cuotas`} span={24} labelAlign='left'>
                                    <Checkbox.Group
                                        className='checkbox-options-horizontal'
                                        values={formState?.cuotes}
                                        onChange={onChangeCuotes}
                                        options={cuotess.map((cuote, index) => {
                                            return {
                                                label: cuote.format,
                                                value: cuote.date,
                                                key: index,
                                            };
                                        })}
                                    />
                                </Form.Item>
                        </div>
                    </LayoutH>
                    <LayoutH>
                        <Form.Item label={`Fecha de pago *`} labelAlign='left' span={22}>
                            <DatePicker name='date' onChange={(date) => setFormState({...formState, date: dayjs(date)})} format={DDMMYYYY} value={formState?.date ? dayjs(formState?.date)  : undefined}/>
                        </Form.Item>
                        <Form.Item label='Aplica descuento' labelAlign='left' span={8}>
                            <Switch name='apply_discount' disabled={confirmLoading} onChange={(apply_discount) => setFormState({...formState, apply_discount})} checked={formState?.apply_discount} />
                        </Form.Item>
                        <Form.Item label='Aplica recargo' labelAlign='left' span={8}>
                            <Switch name='apply_surcharge' disabled={confirmLoading || formState?.apply_discount} onChange={(apply_surcharge) => setFormState({...formState, apply_surcharge})} checked={formState?.apply_surcharge} />
                        </Form.Item>
                        <Form.Item label='Cantidad de cuotas' labelAlign='left' span={8}>
                            <InputNumber min={0} name='amount_coute' disabled={confirmLoading} onChange={(amount_coute) => setFormState({...formState, amount_coute})} value={formState?.amount_coute} />
                        </Form.Item>
                    </LayoutH>
                    <LayoutH>
                        <Form.Item label='Descuento' labelAlign='left' span={8}>
                            <InputNumber min={0} style={{borderColor: 'green'}} name='discount' disabled={confirmLoading || !formState?.apply_discount} onChange={(discount) => setFormState({...formState, discount})} value={formState?.discount} />
                        </Form.Item>
                        <Form.Item label='Recargo' labelAlign='left' span={8}>
                            <InputNumber min={0} style={{borderColor: 'red'}} name='surcharge' disabled={confirmLoading || formState?.apply_discount || !formState?.apply_surcharge} onChange={(surcharge) => setFormState({...formState, surcharge})} value={formState?.surcharge} />
                        </Form.Item>
                        <Form.Item label='Valor Couta' labelAlign='left' span={6}>
                            <InputNumber min={0} name='value_cuote' disabled={confirmLoading} onChange={(value_cuote) => setFormState({...formState, value_cuote})} value={formState?.value_cuote} />
                        </Form.Item>
                        <Form.Item label='Observacion' labelAlign='left' span={22}>
                            <TextArea name='observation' disabled={confirmLoading} onChange={(e) => setFormState({...formState, observation: e.target.value})} value={formState?.observation} />
                        </Form.Item>
                    </LayoutH>
                </div>
                <div span={24} style={{textAlign: 'right'}}>
                    <h2 style={{marginRight: 40}}>Total  ${formState.total}</h2>
                    {formState.canceled && <h2 style={{padding: 10, textAlign: 'center', backgroundColor: !formState.canceled && '#ffc7c7'}}>Cancelado el 02/05/2201{formState?.canceled_date} por {formState?.user_canceled?.names +' '+ formState?.user_canceled?.lastnames}</h2>}
                </div>
                <div span={24} style={{textAlign: 'center'}}>
                    <Button onClick={() => onOk()}>Generar Pago</Button>
                </div>
            </LayoutH>
        </Form>
    )
}