import React, { useEffect, useState } from 'react'

import { Button, Checkbox, Form, Input, InputNumber, Select, Tabs } from 'antd'
import Loading from '../components/common/Loading'
import LayoutH from '../components/layout/LayoutH';
import { alertError, renderError } from '../common/functions';
import { instituteCombo } from '../services/InstituteService';
import { documentCategoryCombo } from '../services/DocumentCategoryService';
import { userCombo } from '../services/UserService';
import { documentCombo } from '../services/DocumentService';
import { CourseDocumentTable } from '../tables/CourseDocumentTable';

export const CourseForm = ({ view, loading, confirmLoading, formState, onInputChange, onInputChangeByName, onInputChangeByObject }) => {    
    
    let [documental_categories, setDocumental_categories ] = useState([]);
    let [loadingDocumentCategories, setLoadingDocumentCategories ] = useState(false);

    let [documents, setDocuments ] = useState([]);
    let [loadingDocuments, setLoadingDocuments ] = useState(false);
    let [documentSelected, setDocumentSelected ] = useState(undefined);

    let [disabledTuition_value, setDisabledTuition_value ] = useState(true);


    const fetchDocumental_categories = async () => {
        setLoadingDocumentCategories(true);
        try {
            const documental_categories = await documentCategoryCombo();
            setDocumental_categories(documental_categories);
            setLoadingDocumentCategories(false);
        } catch(err) {
            setLoadingDocumentCategories(false);
            renderError(err);
        }
    };

    const fetchDocuments = async (Documental_category_id) => {
        setLoadingDocuments(true);
        try {
            if(Documental_category_id){
                const documents = await documentCombo({ Documental_category_id });
                setDocuments(documents);
            }else{
                setDocuments([]);
            }
            
            setLoadingDocuments(false);
        } catch(err) {
            setLoadingDocuments(false);
            renderError(err);
        }
    };

    useEffect(() => {
        fetchDocumental_categories();

        if(formState?.tuition){
            setDisabledTuition_value(false);
        }

        if(formState?.documental_category_id){
            fetchDocuments(formState?.documental_category_id);
        }

      }, []);

    const onChangeTuition = (tuition) => {
        setDisabledTuition_value(!tuition)
        onInputChangeByObject({ tuition, tuition_value: undefined });
    };

    const onChangeDocumentalCategoryId = (documental_category_id) => {
        onInputChangeByObject({ documental_category_id });
        fetchDocuments(documental_category_id)
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
                        <Form.Item label={`Categoria documentos`} labelAlign='left' span={8}>
                            <Select 
                                allowClear
                                showSearch
                                disabled={view || confirmLoading || loadingDocumentCategories}
                                loading={loadingDocumentCategories}
                                value={formState?.documental_category_id}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={onChangeDocumentalCategoryId}
                                > 
                                    {documental_categories.map(documental_category => 
                                        <Select.Option value={documental_category.id} key={documental_category.id}>{documental_category.name}</Select.Option>
                                        )}
                                </Select>
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Cantidad Coutas`} labelAlign='left' span={6}>
                            <InputNumber min={0} name='quotas' disabled={view || confirmLoading} onChange={quotas => onInputChangeByName('quotas', quotas)} value={formState?.quotas} />
                        </Form.Item>
                        <Form.Item label={`${!view ? '*' : ''} Valor Couta`} labelAlign='left' span={6}>
                            <InputNumber min={0} name='quota_value' disabled={view || confirmLoading} onChange={quota_value => onInputChangeByName('quota_value', quota_value)} value={formState?.quota_value} />
                        </Form.Item>
                    </LayoutH>
                    <LayoutH>
                        <Form.Item labelAlign='left' span={4}>
                            <Checkbox style={{marginTop: 33}} name='tuition' disabled={view || confirmLoading} onChange={e => onChangeTuition(e.target.checked)} checked={formState?.tuition}>Matricula</Checkbox>
                        </Form.Item>
                        <Form.Item label={`Valor matricula`} labelAlign='left' span={6}>
                            <InputNumber min={0} name='tuition_value' disabled={view || confirmLoading || disabledTuition_value} onChange={tuition_value => onInputChangeByName('tuition_value', tuition_value)} value={formState?.tuition_value} />
                        </Form.Item>
                        <Form.Item label={`Costo Certificado`} labelAlign='left' span={8}>
                            <InputNumber min={0} name='certificate_cost' disabled={view || confirmLoading} onChange={certificate_cost => onInputChangeByName('certificate_cost', certificate_cost)} value={formState?.certificate_cost} />
                        </Form.Item>
                    </LayoutH>
                </>,
        }, {
            label: 'Documentos', 
            key: 'info_documents', 
            children: 
                <CourseDocumentTable
                    data={formState.documents}
                    //onDeleteDocument={deleteDocument}
                />
        }
    ];
    
    return (
        <Form layout='vertical'>
            <Loading loading={loading || loadingDocumentCategories || loadingDocuments}>
                <Tabs
                    style={{ marginTop: -15 }}
                    size='small'
                    items={items}
                />
            </Loading>
        </Form>
    )
}