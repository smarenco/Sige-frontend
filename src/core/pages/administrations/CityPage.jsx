import { Button, Card, Dropdown, Menu, Modal } from 'antd'
import React from 'react'
import { useState } from 'react';
import { alertError, renderError } from '../../common/functions';
import { CityModal } from '../../modals/CityModal';
import City from '../../models/City';
import { AuthService } from '../../services/AuthService';
import { CityTable } from '../../tables/CityTable';

import { cityCreate, cityDelete, cityIndex, cityShow, cityUpdate } from '../../services/CityService';
import { useEffect } from 'react';

export const CityPage = ({ app }) => {

    const [item, setItem] = useState(new City);
    const [filters, setFilters] = useState({});
    const [data, setData] = useState([]);
    const [dataPage, setDataPage] = useState({ page: 1, pageSize: 50});
    const [total, setTotal] = useState(0);
    const [rowSelected, setRowSelected] = useState({selectedRowKeys: [], selectedRows: []});
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { user } = AuthService();

    const { page, pageSize } = dataPage;
    const { selectedRowKeys, selectedRows } = rowSelected;
    
    const dropdownExport = () => (<Menu>
        <Menu.Item onClick={() => cityIndex(filters, 'xls')}>Excel</Menu.Item>
        <Menu.Item onClick={() => cityIndex(filters, 'pdf')}>PDF</Menu.Item>
        <Menu.Item onClick={() => cityIndex(filters, 'csv')}>CSV</Menu.Item>
    </Menu>);

    const renderExtraTable = () => {

        return (
            <>
                <Dropdown overlay={dropdownExport()} placement="bottomLeft" disabled={loading}>
                    <Button style={{ marginRight: 15 }} type="export" disabled={loading}>Exportar</Button>
                </Dropdown>
                <Button.Group>
                    <Button key="new" onClick={e => {setOpenModal(true); setItem(new City); }} disabled={loading}>Nuevo</Button>
                    <Button key="edit" onClick={() => onExtraTableClick('edit')} disabled={loading || selectedRowKeys.length !== 1}>Editar</Button>
                </Button.Group>
                <Button style={{ marginLeft: 15 }} key="delete" onClick={() => onExtraTableClick('delete')} disabled={loading || selectedRowKeys.length === 0} type='danger' ghost>Eliminar</Button>
            </>
        );
    }

    const onExtraTableClick = (action) => {
        switch (action) {
            case 'edit': loadItem(selectedRowKeys[0]); break;
            case 'delete': Modal.confirm({
                title: 'Eliminar registro',
                okType: 'danger',
                okText: 'Eliminar',
                cancelText: 'Cancelar',
                content: `¿Seguro que desea eliminar ${selectedRowKeys.length} ${selectedRowKeys.length !== 1 ? 'registros' : 'registro'}?`,
                onOk: async() => {
                    setLoading(true);
                    try {
                        await cityDelete(selectedRowKeys)
                    } catch(err) {
                        renderError(err);
                    }                        
                    loadData();
                    },
            }); break;
        }
    }

    const onFilterTable = (filter) => {
        setFilters({ ...filters, ...filter });
    }

    const onPageChange = async (page, pageSize) => {
        pageSize = pageSize === undefined ? pageSize : pageSize;
        setDataPage({ ...dataPage, pageSize});
        setLoading(true);

        const { data, total } = await cityIndex({ page, pageSize, ...filters });
        setData(data); setTotal(total); setLoading(false); setRowSelected({selectedRowKeys: [], selectedRows: []});
    }

    const loadData = () => onPageChange(1);

    const loadItem = async(id) => {
        setLoading(true);
        try {
            const item = await cityShow(id)
            setItem(item); setOpenModal(true);
        } catch(err) {
            renderError(err);
        }
    }

    const onModalOk = async(obj) => {
        console.log('guardar')
        setConfirmLoading(true);
        try {
            if (item.id) {
                await cityUpdate(obj.id, obj);
            } else {
                await cityCreate(obj);
            }

            setOpenModal(false); loadData();
        } catch(err) {
            renderError(err);
        }

        setConfirmLoading(false)        
    }

    useEffect(()=>{
        loadData();
    },[]);


    return (
        <>
            <Card
                title={(<strong>Ciudades</strong>)}
                className='ant-section'
                extra={renderExtraTable()}
            >
              <CityTable
                    data={data}
                    onReload={loadData}
                    onRowSelectedChange={(selectedRowKeys, selectedRows) => setRowSelected({ selectedRowKeys, selectedRows })}
                    setFilters={onFilterTable}
                    selectedRowKeys={selectedRowKeys}
                    loading={loading}
                    onPageChange={onPageChange}
                    pagination={{
                        pageSize: pageSize,
                        page: page,
                        total: total,
                    }}
                    onEditClick={loadItem}
              />
            </Card>
            <CityModal
                app={app}
                open={openModal}
                item={item}
                onOk={onModalOk}
                confirmLoading={confirmLoading}
                loading={loading}
                onCancel={() => { setOpenModal(false); setItem(new City); }}
            />
        </>
    )
}
