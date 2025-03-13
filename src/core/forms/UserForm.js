import React, { useEffect, useState } from 'react'

import { Form, Input, Select, DatePicker, Tabs, Checkbox, Divider, InputNumber } from 'antd'
import Loading from '../components/common/Loading'
import LayoutH from '../components/layout/LayoutH';
import TextArea from 'antd/lib/input/TextArea';
import { loadTypes, renderError } from '../common/functions';
import { medicalCoverageCombo } from '../services/MedicalCoverageService';
import { cityCombo } from '../services/CityService';
import { countryCombo } from '../services/CountryService';
import { documentCategoryCombo } from '../services/DocumentCategoryService';
import { groupCombo } from '../services/GroupService';
import { documentCombo } from '../services/DocumentService';
import { DocumentsUserTable } from '../tables/DocumentsUserTable';
import { DocumentsUserModal } from '../modals/DocumentsUserModal';
import { GroupTable } from '../tables/GroupTable';
import { DDMMYYYY, genders, education_level } from '../common/consts';
import dayjs from 'dayjs';

export const UserForm = ({ view, loading, confirmLoading, formState, onInputChange, onInputChangeByName }) => {

    const [ medicalCoverages, setMedicalCoverage ] = useState([]);
    const [ countries, setCountry ] = useState([]);
    const [ cities, setCities ] = useState([]);
    const [ userTypes, setUserTypes ] = useState([]);
    const [ groups, setGroups ] = useState([]);
    const [ courseSelected, setCourseSelected ] = useState(undefined);
    const [ documents, setDocuments ] = useState([]);
    const [ documentToSee, setDocumentToSee ] = useState({});
    const [ loadingDocument, setLoadingDocument ] = useState(false);
    const [ openModalDocument, setOpenModalDocument ] = useState(false);
    const [ documentCategory, setDocumentCategory ] = useState([]);
    const [ documentCategorySelected, setDocumentCategorySelected ] = useState(undefined);
    
    const [ loadingMedicalCoverages, setLoadingMedicalCoverages ] = useState(undefined);
    const [ loadingDocumentCategory, setLoadingDocumentCategory ] = useState(undefined);
    const [ loadingGroups, setLoadingGroups ] = useState(undefined);
    const [ loadingCountries, setLoadingCountries ] = useState(undefined);
    const [ loadingCities, setLoadingCities ] = useState(undefined);
    const [ loadingDocuments, setLoadingDocuments ] = useState(undefined);
    const [ loadingTypes, setLoadingTypes ] = useState(undefined);
    
    const fetchMedicalCoverages = async () => {
        setLoadingMedicalCoverages(true);
        try {
            const medicalCoverage = await medicalCoverageCombo();
            setMedicalCoverage(medicalCoverage);
            setLoadingMedicalCoverages(false);
        } catch(err) { renderError(err); setLoadingMedicalCoverages(false);}
    };

    const fetchDocumentCategory = async (Type) => {
        if(Type){
            setLoadingDocumentCategory(true);
            try {
                const documentCategory = await documentCategoryCombo({Type});
                setDocumentCategory(documentCategory);
                setLoadingDocumentCategory(false);
            } catch(err) { renderError(err); setLoadingDocumentCategory(false);}
        }else{
            setDocumentCategory([]);
        }
    };

    const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
            if(formState.id){
                const groups = await groupCombo({ user_type: formState?.type?.toLowerCase(), user_id: formState?.id});
                setGroups(groups);
                setLoadingGroups(false);
            }
        } catch(err) { renderError(err); setLoadingGroups(false);}
    };

    const fetchCountries = async () => {
        setLoadingCountries(true);
        try {
            const country = await countryCombo();
            setCountry(country);
            setLoadingCountries(false);
        } catch(err) { renderError(err); setLoadingCountries(false);}
    };

    const fetchCities = async (country_id) => {
        if(country_id){
            setLoadingCities(true);
            try {
                const cities = await cityCombo({country_id});
                setCities(cities);
                setLoadingCities(false);
            } catch(err) { renderError(err); setLoadingCities(false);}
        }else{
            setCities([]);
        }
    };

    const fetchDocuments = async (filter) => {
        setLoadingDocuments(true);
        try {
            if(formState.id){
                filter.user_id = formState.id;
                filter.user_type = formState.type;
            }
            const documents = await documentCombo(filter);
            setDocuments(documents);
            setLoadingDocuments(false);
        } catch(err) { renderError(err); setLoadingDocuments(false);}
    };

    const fetchTypes = async (gender) => {
        setLoadingTypes(true);
        try {
            const types = loadTypes(gender);
            setUserTypes(types);
            setLoadingTypes(false);
        } catch(err) { renderError(err); setLoadingTypes(false);}
    };

    useEffect(() => {
        fetchMedicalCoverages();
        fetchCountries();
        fetchGroups();
    }, []);

    useEffect(() => {
        fetchCities(formState.country_id);
    }, [formState.country_id]);

    useEffect(() => {
        if(courseSelected){
            fetchDocuments({ course_id: courseSelected });
        }else{
            setDocuments([]);
        }
    }, [courseSelected]);

    useEffect(() => {
        fetchTypes(formState.gender);
    }, [formState.gender]);

    useEffect(() => {
        if(formState.type && formState.type !== 'student'){
            fetchDocumentCategory(formState.type);
        }
    }, [formState.type]);

    useEffect(() => {
        if(documentCategorySelected){
            fetchDocuments({ document_category_id: documentCategorySelected });
        }else{
            setDocuments([]);
        }
    }, [documentCategorySelected]);

    const mergeDataSchema = (data, schema) => {
        //console.log('schema',schema)
        //console.log('data',data)
        let schema2 = [ ...schema];
        return schema2.map(item => {
            item.loaded = false;
            item.observation = '';
            item.expiration = null;
            item.file_name = null;
            item.document_id = item.id;
            item.file = null;
            item.name_desc = item.name + (item.required ? ' (*)' : '');

            for (let i in data) {
                if (data[i]?.document_id === item.document_id) {
                    let doc = data[i];
                    item.loaded = true;
                    item.expiration = doc.expiration;
                    item.file = doc.file;
                    item.file_name = doc.file_name;
                    item.observation = doc.observation;
                }
            }
            return item;
        });
    }

    const loadRequisitoFuncionario = (id) => {
        const schema = documents.filter((document) => document.id === id);
        const documentToSee = formState.documents.filter((document) => document.id === id);

        setOpenModalDocument(true);
        setDocumentToSee(mergeDataSchema(documentToSee || [], schema)[0]);
    }

    const removeDocument = (documentSee) => {
        //console.log('documentSee',documentSee);
        //console.log('formState.documents', formState.documents);
        const documents = formState.documents.filter((document) => document.document_id !== documentSee.document_id);
        onInputChangeByName('documents', documents);
    }

    const items = [
        { 
            label: 'Datos Basicos', 
            key: 'info_basic', 
            children: 
                <LayoutH>
                    <Form.Item label={`${!view ? '*' : ''} Documento`} labelAlign='left' span={4}>
                        <Input name='document' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.document} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Nombres`} labelAlign='left' span={6}>
                        <Input name='names' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.names} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Apellidos`} labelAlign='left' span={6}>
                        <Input name='lastnames' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.lastnames} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Fecha nacimiento`} labelAlign='left' span={4}>
                        <DatePicker name='birth_day' onChange={(birth_day) => onInputChangeByName('birth_day', birth_day)} format={DDMMYYYY} value={formState?.birth_day ? dayjs(formState?.birth_day)  : undefined}/>
                    </Form.Item>
                    <Form.Item label='Genero' labelAlign='left' span={4}>
                        <Select 
                            allowClear 
                            showSearch 
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                            name='gender' 
                            disabled={view || confirmLoading} 
                            onChange={(gender) => onInputChangeByName('gender', gender)} 
                            value={formState?.gender}
                        >
                            {genders.map(gender => 
                                <Select.Option value={gender.id} key={gender.id}>{gender.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Direccion' labelAlign='left' span={9}>
                        <Input name='direction' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.direction} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Telefono`} labelAlign='left' span={5}>
                        <Input name='cell_phone' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.cell_phone} />
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Email`} labelAlign='left' span={6}>
                        <Input type="email" name='email' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.email} />
                    </Form.Item>
                    <Form.Item label='Contraseña' labelAlign='left' span={4}>
                        <Input placeholder='Solo si desea cambiarla' type="password" name='password' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.password} />
                    </Form.Item>
                    <Form.Item label='Pais' labelAlign='left' span={5}>
                        <Select 
                            allowClear 
                            showSearch 
                            name='country_id'
                            loading={loadingCountries}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading || loadingCountries} 
                            onChange={(country_id) => onInputChangeByName('country_id', country_id)} 
                            value={formState?.country_id}
                        >
                            {countries.map(country => 
                                <Select.Option value={country.id} key={country.id}>{country.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Ciudad' labelAlign='left' span={5}>
                        <Select 
                            allowClear 
                            showSearch
                            name='city_id'
                            loading={loadingCities}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading || loadingCities} 
                            onChange={(city_id) => onInputChangeByName('city_id', city_id)} 
                            value={formState?.city_id}
                        >
                            {cities.map(city => 
                                <Select.Option value={city.id} key={city.id}>{city.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Localidad' labelAlign='left' span={8}>
                        <Input name='location' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.location} />
                    </Form.Item>
                    <Form.Item label='Cobertura medica' labelAlign='left' span={6}>
                        <Select 
                            allowClear 
                            showSearch 
                            name='medical_coverage_id'
                            loading={loadingMedicalCoverages}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading || loadingMedicalCoverages} 
                            onChange={(medical_coverage_id) => onInputChangeByName('medical_coverage_id', medical_coverage_id)} 
                            value={formState?.medical_coverage_id}
                        >
                            {medicalCoverages.map(medicalCoverage => 
                                <Select.Option value={medicalCoverage.id} key={medicalCoverage.id}>{medicalCoverage.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label={`${!view ? '*' : ''} Tipo usuario`} labelAlign='left' span={5}>
                        <Select 
                            allowClear 
                            showSearch 
                            name='type'
                            loading={loadingTypes}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading || loadingTypes} 
                            onChange={(type) => onInputChangeByName('type', type)} 
                            value={formState?.type?.toLowerCase()}
                        >
                            {userTypes.map(type => 
                                <Select.Option value={type.id} key={type.id}>{type.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Dia tolerancia' labelAlign='left' span={5}>
                        <InputNumber name='tolerance_day' min={1} max={31} onChange={tolerance_day => onInputChangeByName('tolerance_day', tolerance_day)} value={formState?.tolerance_day} />
                    </Form.Item>
                </LayoutH> 
        },
        { 
            label: 'Documentos', 
            key: 'documents', 
            children: 
            <div>
                hola
                {/* <LayoutH>
                    {(formState?.type?.toLowerCase() === 'student' || formState?.type?.toLowerCase() === 'teacher') && <Form.Item label='Cursos' labelAlign='left' span={12}>
                        <Select 
                            allowClear
                            showSearch
                            disabled={loadingGroups}
                            loading={loadingGroups}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={course_id => setCourseSelected(course_id)}
                        > 
                            {groups.map(group => 
                                <Select.Option value={group.course_id} key={group.course_id}>{group.course_name} ({group.name})</Select.Option>
                            )}
                        </Select>
                    </Form.Item>}
                    {formState?.type?.toLowerCase() !== 'student' && formState?.type?.toLowerCase() !== 'teacher' && <Form.Item label='Categoria' labelAlign='left' span={12}>
                        <Select 
                            allowClear
                            showSearch
                            disabled={view || confirmLoading || loadingDocumentCategory}
                            loading={loadingDocumentCategory}
                            value={formState?.document_category_id}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={document_category_id => {onInputChangeByName('document_category_id', document_category_id); setDocumentCategorySelected(document_category_id);}}
                        > 
                            {documentCategory.map(category => 
                                <Select.Option value={category.id} key={category.id}>{category.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>}
                </LayoutH>
                <DocumentsUserTable
                    dataSource={mergeDataSchema(formState.documents, [ ...documents])}
                    loading={loadingDocuments}
                    loadRequisitoFuncionario={loadRequisitoFuncionario}
                    removeDocument={removeDocument}
                />
                <DocumentsUserModal
                    visible={openModalDocument}
                    loading={loadingDocument}
                    item={documentToSee}
                    onOkProp={document => {

                        ////console.log('document', document)
                        //console.log('formState',formState.documents)

                        setLoadingDocument(true);
                        const documents = formState.documents.filter(FSdocument => FSdocument.document_id !== document.document_id);
                        //console.log('documents',documents)
                        const docs = [...documents, document];
                        //console.log('docs',docs)
                        onInputChangeByName('documents', docs);
                        setLoadingDocument(false);
                        setOpenModalDocument(false);
                        setDocumentToSee({});
                                                            
                    }}
                    onCancel={() => { setOpenModalDocument(false); setDocumentToSee({}); }}
                /> */}
            </div>
        },
        { 
            label: 'Cursos', 
            key: 'courses',
            disabled: formState?.type?.toLowerCase() !== 'student' && formState?.type?.toLowerCase() !== 'teacher',
            children: 
            <>
                <GroupTable
                    data={groups}
                    loading={loadingGroups}
                    comeUserForm={true}
                />
            </>
        },
        { 
            label: 'Especificos', 
            key: 'specifics', 
            children: 
                <LayoutH>
                    <Form.Item labelAlign='left' span={6}>
                        <Checkbox name='work_in_Area_similar' disabled={view || confirmLoading} onChange={(e) => onInputChangeByName('work_in_Area_similar', e.target.checked)} checked={formState?.work_in_Area_similar}>Trabaja en area similar</Checkbox>
                    </Form.Item>
                    <Form.Item labelAlign='left' span={8}>
                        <Checkbox name='has_knowledge_in_area' disabled={view || confirmLoading} onChange={(e) => onInputChangeByName('has_knowledge_in_area', e.target.checked)} checked={formState?.has_knowledge_in_area}>Tiene conocimiento en el area</Checkbox>
                    </Form.Item>
                    <Form.Item labelAlign='left' span={4}>
                        <Checkbox name='trained' disabled={view || confirmLoading} onChange={(e) => onInputChangeByName('trained', e.target.checked)} checked={formState?.trained}>Entrenado</Checkbox>
                    </Form.Item>
                    <Form.Item label='Expectativas' labelAlign='left' span={18}>
                        <TextArea name='expectations' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.expectations} />
                    </Form.Item>
                    <Form.Item label='Nivel Educacion' labelAlign='left' span={6}>
                        <Select 
                            allowClear 
                            showSearch 
                            name='education_level'
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            disabled={view || confirmLoading}
                            onChange={(education_level) => onInputChangeByName('education_level', education_level)}
                            value={formState?.education_level}
                        >
                            {education_level.map(level => 
                                <Select.Option value={level.id} key={level.id}>{level.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                </LayoutH> 
        },
    ];
    
    return (
        loading ? <Loading /> : <Form layout='vertical'>
            <Tabs
                style={{ marginTop: -15 }}
                size='small'
                items={items} 
            />
            <Divider span={24}/>
            <Form.Item label='Observaciones' labelAlign='left' span={24}>
                <TextArea name='observation' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.observation} />
            </Form.Item>
        </Form>
    )
}