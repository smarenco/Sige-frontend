import { Button, Card, Divider, Dropdown, Form, Input, Select, Space } from 'antd'

import { useState } from 'react';
import { alertError, loadTypes, renderError } from '../../common/functions';
import { DownOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';

import { useEffect } from 'react';
import { ExpiredDocumentTable } from '../../tables/ExpiredDocumentTable';
import LayoutH from '../../components/layout/LayoutH';
import { documentExpired, notifyExpiredDocument } from '../../services/UserService';

export const ConsultExpiredDocumentPage = ({ app }) => {

    const [filters, setFilters] = useState({ExpiredType: 'PorVencer', CantidadDias: 15});
    const [data, setData] = useState([]);
    const [dataPage, setDataPage] = useState({ page: 1, pageSize: 50});
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [notifyLoading, setNotifyLoading] = useState(false);
    const [ userTypes, setUserTypes ] = useState([]);
    const [ loadingTypes, setLoadingTypes ] = useState(undefined);

    const { page, pageSize } = dataPage;
    
    const items = [
        {
            label: 'Excel',
            key: '1',
            icon: <FileExcelOutlined />,
            onClick: () => documentExpired(filters, 'xls')
        },
        {
            label: 'PDF',
            key: '2',
            icon: <FilePdfOutlined />,
            onClick: () => documentExpired(filters, 'pdf')
        },
        {
            label: 'CSV',
            key: '3',
            icon: <FileTextOutlined />,
            onClick: () => documentExpired(filters, 'csv')
        }
    ];

    const menuProps = {
        items
    };

    const fetchTypes = async () => {
        setLoadingTypes(true);
        try {
            const types = loadTypes();
            setUserTypes(types);
            setLoadingTypes(false);
        } catch(err) { renderError(err); setLoadingTypes(false);}
    };

    const renderExtraTable = () => {
        return (
            <>
                <Dropdown menu={menuProps} placement="bottomLeft" disabled={loading}>
                    <a onClick={(e) => e.preventDefault()}><Space> Exportar <DownOutlined /> </Space></a>
                </Dropdown>
            </>
        );
    }

    const onPageChange = async (page, pageSize) => {
        pageSize = pageSize === undefined ? pageSize : pageSize;
        setDataPage({ ...dataPage, pageSize, page});
        setLoading(true);

        try{
            const { data, total } = await documentExpired({ page, pageSize, ...filters });
            setData(data); setTotal(total); setLoading(false);
        }catch(err){
            alertError(err);
            setLoading(false);
        }
    }

    const onNotifyExpiredDocument = async(id) => {
        setNotifyLoading(true);
        try {
            if (id) {
                await notifyExpiredDocument(id);
                onPageChange(1);
            }
        } catch(err) {
            renderError(err);
        }

        setNotifyLoading(false)        
    }

    useEffect(()=>{
        fetchTypes();
    },[]);


    return (
        <>
            <LayoutH>
                <Card
                    title={<strong>Filtros</strong>}
                    className='ant-section'
                    span={6}
                    style={{ marginBottom: 25 }}
                >
                    <div style={{ padding: 10 }}>
                        <Form.Item className='compact' style={{ marginTop: 10 }}>
                            <Select 
                                showSearch
                                disabled={loading}
                                name='ExpiredType'
                                onChange={(ExpiredType) => setFilters({ ...filters, ExpiredType })}
                                value={filters?.ExpiredType}
                            >
                                <Select.Option value='PorVencer' key='PorVencer'>Por vencer (días)</Select.Option>
                                <Select.Option value='YaVencieron' key='YaVencieron'>Ya vencieron (días)</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Input
                                value={filters.CantidadDias}
                                disabled={loading}
                                placeholder='Cantidad de dias'
                                onChange={e => setFilters({ ...filters, CantidadDias: e.target.value })}
                            />
                        </Form.Item>
                        <Divider className='compact' />
                        <Form.Item label='Tipo usuario' labelAlign='left'>
                            <Select 
                                allowClear 
                                showSearch 
                                name='type'
                                loading={loadingTypes}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled={loadingTypes ||loading}
                                onChange={(UserType) => setFilters({ ...filters, UserType })}
                                value={filters?.UserType?.toLowerCase()}
                            >
                                {userTypes.map(type => 
                                    <Select.Option value={type.id} key={type.id}>{type.name}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Divider className='compact' />
                    </div>
                    <div style={{ padding: 10, textAlign: 'end' }}>
                        <Button
                            type='primary'
                            onClick={() => onPageChange(1)}
                            disabled={loading}
                            loading={loading}>Buscar</Button>
                        <Button
                            style={{ marginLeft: '10px', marginTop: 10 }}
                            type='default'
                            onClick={() => documentExpired(filters, 'xls')}
                            disabled={loading}>Exportar a Excel</Button>            
                    </div>
                </Card>
                <Card
                    title={(<strong>Consulta Documentos con Vencimiento</strong>)}
                    className='ant-section'
                    extra={renderExtraTable()}
                    span={18}
                >
                    <ExpiredDocumentTable
                            data={data}
                            loading={loading}
                            notifyLoading={notifyLoading}
                            onPageChange={onPageChange}
                            paginationProps={{
                                pageSize: pageSize,
                                page: page,
                                total: total,
                            }}
                            onNotifyExpiredDocumentClick={onNotifyExpiredDocument}
                    />
                </Card>
             </LayoutH>
        </>
    )
}
