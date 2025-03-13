import React, { useEffect, useState } from 'react'

import { Checkbox, Form, Input, InputNumber, Select, Tabs } from 'antd'
import Loading from '../components/common/Loading'
import LayoutH from '../components/layout/LayoutH';
import { renderError } from '../common/functions';
import { documentCategoryCombo, documentCategoryShow } from '../services/DocumentCategoryService';
import { DocumentCategoryDocumentTable } from '../tables/DocumentCategoryDocumentTable';

export const CourseForm = ({ view, loading, confirmLoading, formState, onInputChange, onInputChangeByName, onInputChangeByObject }) => {    
    
    let [student_documental_categories, setStudent_Documental_categories ] = useState([]);
    let [teacher_documental_categories, setTeacher_Documental_categories ] = useState([]);
    let [loadingStudentDocumentCategories, setLoadingStudentDocumentCategories ] = useState(false);
    let [loadingTeacherDocumentCategories, setLoadingTeacherDocumentCategories ] = useState(false);

    let [studentDocuments, setStudentDocuments ] = useState([]);
    let [loadingStudentDocuments, setLoadingStudentDocuments ] = useState(false);
    let [teacherDocuments, setTeacherDocuments ] = useState([]);
    let [loadingTeacherDocuments, setLoadingTeacherDocuments ] = useState(false);

    let [disabledTuition_value, setDisabledTuition_value ] = useState(true);

    const fetchStudent_documental_categories = async () => {
        setLoadingStudentDocumentCategories(true);
        try {
            const documental_categories = await documentCategoryCombo({Type: 'student'});
            setStudent_Documental_categories(documental_categories);
            setLoadingStudentDocumentCategories(false);
        } catch(err) {
            setLoadingStudentDocumentCategories(false);
            renderError(err);
        }
    };

    const fetchTeacher_documental_categories = async () => {
        setLoadingTeacherDocumentCategories(true);
        try {
            const documental_categories = await documentCategoryCombo({Type: 'teacher'});
            setTeacher_Documental_categories(documental_categories);
            setLoadingTeacherDocumentCategories(false);
        } catch(err) {
            setLoadingTeacherDocumentCategories(false);
            renderError(err);
        }
    };

    const fetchTeacherDocumentsCategoryDocuments = async (Documental_category_id) => {
        setLoadingTeacherDocuments(true);
        try {
            if(Documental_category_id){
                const documentCategory = await documentCategoryShow(Documental_category_id);
                setTeacherDocuments(documentCategory.documental_category_document);
            }else{
                setTeacherDocuments([]);
            }
            setLoadingTeacherDocuments(false);
        } catch(err) {
            setLoadingTeacherDocuments(false);
            renderError(err);
        }
    };

    const fetchStudentDocumentsCategoryDocuments = async (Documental_category_id) => {
        setLoadingStudentDocuments(true);
        try {
            if(Documental_category_id){
                const documentCategory = await documentCategoryShow(Documental_category_id);
                setStudentDocuments(documentCategory.documental_category_document);
            }else{
                setStudentDocuments([]);
            }
            setLoadingStudentDocuments(false);
        } catch(err) {
            setLoadingStudentDocuments(false);
            renderError(err);
        }
    };

    useEffect(() => {
        fetchStudent_documental_categories();
        fetchTeacher_documental_categories();

        if(formState?.tuition){
            setDisabledTuition_value(false);
        }

        if(formState?.student_documental_category_id){
            fetchStudentDocumentsCategoryDocuments(formState?.student_documental_category_id);
        }

        if(formState?.teacher_documental_category_id){
            fetchTeacherDocumentsCategoryDocuments(formState?.teacher_documental_category_id);
        }

      }, []);

    const onChangeTuition = (tuition) => {
        setDisabledTuition_value(!tuition)
        onInputChangeByObject({ tuition, tuition_value: undefined });
    };

    const items = [
        { 
            label: 'Datos Basicos', 
            key: 'info_basic', 
            children:      
                <>
                    <LayoutH>
                        <Form.Item label={`${!view ? '*' : ''} Nombre`} labelAlign='left' span={12}>
                            <Input name='name' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.name} />
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Identificador`} labelAlign='left' span={12}>
                            <Input name='identifier' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.identifier} />
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Cantidad Coutas`} labelAlign='left' span={5}>
                            <InputNumber min={0} name='quotas' disabled={view || confirmLoading} onChange={quotas => onInputChangeByName('quotas', quotas)} value={formState?.quotas} />
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Valor Couta`} labelAlign='left' span={5}>
                            <InputNumber min={0} name='quota_value' disabled={view || confirmLoading} onChange={quota_value => onInputChangeByName('quota_value', quota_value)} value={formState?.quota_value} />
                        </Form.Item>
                        <Form.Item labelAlign='left' span={4}>
                            <Checkbox style={{marginTop: 33}} name='tuition' disabled={view || confirmLoading} onChange={e => onChangeTuition(e.target.checked)} checked={formState?.tuition}>Matricula</Checkbox>
                        </Form.Item>
                        <Form.Item label={`Valor matricula`} labelAlign='left' span={5}>
                            <InputNumber min={0} name='tuition_value' disabled={view || confirmLoading || disabledTuition_value} onChange={tuition_value => onInputChangeByName('tuition_value', tuition_value)} value={formState?.tuition_value} />
                        </Form.Item>
                        <Form.Item label={`Costo Certificado`} labelAlign='left' span={5}>
                            <InputNumber min={0} name='certificate_cost' disabled={view || confirmLoading} onChange={certificate_cost => onInputChangeByName('certificate_cost', certificate_cost)} value={formState?.certificate_cost} />
                        </Form.Item>
                    </LayoutH>
                </>,
        }, {
            label: 'Documentos Estudiantes', 
            key: 'info_documents_stu', 
            children:
                <>
                    <LayoutH>
                        <Form.Item label={`Categoria documentos estudiantes`} labelAlign='left' span={12}>
                            <Select 
                                allowClear
                                showSearch
                                disabled={view || confirmLoading || loadingStudentDocumentCategories}
                                loading={loadingStudentDocumentCategories}
                                value={formState?.student_documental_category_id}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(student_documental_category_id) => {
                                    onInputChangeByName('student_documental_category_id', student_documental_category_id);
                                    fetchStudentDocumentsCategoryDocuments(student_documental_category_id);
                                }}
                            > 
                                {student_documental_categories.map(documental_category => 
                                    <Select.Option value={documental_category.id} key={documental_category.id}>{documental_category.name}</Select.Option>
                                    )}
                            </Select>
                        </Form.Item>
                    </LayoutH>
                    <DocumentCategoryDocumentTable data={studentDocuments} view={true} loading={loadingStudentDocuments} />
                </>
        }, {
            label: 'Documentos Profesores', 
            key: 'info_documents', 
            children:
                <>
                    <LayoutH>
                        <Form.Item label={`Categoria documentos profesores`} labelAlign='left' span={12}>
                            <Select 
                                allowClear
                                showSearch
                                disabled={view || confirmLoading || loadingTeacherDocumentCategories}
                                loading={loadingTeacherDocumentCategories}
                                value={formState?.teacher_documental_category_id}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(teacher_documental_category_id) => {
                                    onInputChangeByName('teacher_documental_category_id', teacher_documental_category_id);
                                    fetchTeacherDocumentsCategoryDocuments(teacher_documental_category_id);
                                }}
                            > 
                                {teacher_documental_categories.map(documental_category => 
                                    <Select.Option value={documental_category.id} key={documental_category.id}>{documental_category.name}</Select.Option>
                                    )}
                            </Select>
                        </Form.Item>
                    </LayoutH>
                    <DocumentCategoryDocumentTable data={teacherDocuments} view={true} loading={loadingTeacherDocuments} />
                </>
        }
    ];
    
    return (
        loading ? <Loading /> : <Form layout='vertical'>
            <Tabs
                style={{ marginTop: -15 }}
                size='small'
                items={items}
            />
        </Form>
    )
}