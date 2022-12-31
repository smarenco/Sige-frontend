import { Button, Card, Dropdown, Menu, Modal } from 'antd'

import { useState } from 'react';
import { alertError, renderError } from '../../common/functions';
import { PaymentModal } from '../../modals/PaymentModal';
import Payment from '../../models/Payment';
import { AuthService } from '../../services/AuthService';
import { PaymentTable } from '../../tables/PaymentTable';

import { paymentCreate, paymentDelete, paymentIndex, paymentShow, paymentUpdate } from '../../services/PaymentService';
import { useEffect } from 'react';

export const PaymentPage = ({ app }) => {

    const [item, setItem] = useState(new Payment);
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
        <Menu.Item onClick={() => paymentIndex(filters, 'xls')}>Excel</Menu.Item>
        <Menu.Item onClick={() => paymentIndex(filters, 'pdf')}>PDF</Menu.Item>
        <Menu.Item onClick={() => paymentIndex(filters, 'csv')}>CSV</Menu.Item>
    </Menu>);

    const renderExtraTable = () => {

        return (
            <>
                <Dropdown overlay={dropdownExport()} placement="bottomLeft" disabled={loading}>
                    <Button style={{ marginRight: 15 }} type="export" disabled={loading}>Exportar</Button>
                </Dropdown>
                <Button.Group>
                    <Button key="new" onClick={e => {setOpenModal(true); setItem(new Payment); }} disabled={loading}>Nuevo</Button>
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
                        await paymentDelete(selectedRowKeys)
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

        try{
            const { data, total } = await paymentIndex({ page, pageSize, ...filters });
            setData(data); setTotal(total); setLoading(false); setRowSelected({selectedRowKeys: [], selectedRows: []});
        }catch(err){
            setLoading(false);
        }
    }

    const loadData = () => onPageChange(1);

    const loadItem = async(id) => {
        setLoading(true);
        try {
            const item = await paymentShow(id)
            setItem(item); setOpenModal(true); setLoading(false);
        } catch(err) {
            setLoading(false);
            renderError(err);
        }
    }

    const onModalOk = async(obj) => {
        console.log('guardar')
        setConfirmLoading(true);
        try {
            if (item.id) {
                await paymentUpdate(obj.id, obj);
            } else {
                await paymentCreate(obj);
            }

            setOpenModal(false); loadData();
        } catch(err) {
            renderError(err);
        }

        setConfirmLoading(false)        
    }

    useEffect(()=>{
        //loadData();
    },[]);


    return (
        <>
            <Card
                title={(<strong>Pagos</strong>)}
                className='ant-section'
                extra={renderExtraTable()}
            >
              <PaymentTable
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
            <PaymentModal
                app={app}
                open={openModal}
                item={item}
                onOk={onModalOk}
                confirmLoading={confirmLoading}
                loading={loading}
                onCancel={() => { setLoading(false); setOpenModal(false); setItem(new Payment); }}
            />
        </>
    )
}
