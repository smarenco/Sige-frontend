import { Button, Modal, Table, Tag } from 'antd';
import { DownloadOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { DDMMYYYY, methods_payments } from '../common/consts';
import { downloadDocument } from '../services/AccountPaymentService';
import dayjs from 'dayjs';
import Loading from '../components/common/Loading';


const paginationStyle = {
    marginRight: 24,
    marginLeft: 24,
    marginBottom: 0,
    position: 'absolute',
    bottom: 11,
    right: 0,
};

export const AccountPaymentTable = ({ viewAll, confirmLoading, data, onChangeState, onReload, onRowSelectedChange, selectedRowKeys, loading, onPageChange, pagination, onEditClick: onEdit }) => {

    const onPageChangeLocal = (page, pageSize) => {
        onPageChange(page, pageSize);
    }
    
    const onEditClick = (id) => {
        onEdit(id);
    }
    
    const columns = () => {
        return [
            {
                title: 'Pago',
                dataIndex: 'created_at',
                render:(i) => i ? dayjs(i).format(DDMMYYYY) : undefined,
                key: 'Pago',
                width: 150,
                ellipsis: true,
                className: 'ant-table-cell-link',
            },{
                title: 'Pago correspondiente a',
                dataIndex: 'payment_day',
                render:(i) => i ? dayjs(i).format(DDMMYYYY) : undefined,
                key: 'Pagoday',
                width: 150,
                ellipsis: true,
                className: 'ant-table-cell-link',
            }, {
                title: 'Referencia',
                dataIndex: 'reference',
                key: 'Referencia',
                width: 150,
                ellipsis: true,
                className: 'ant-table-cell-link',
            }, {
                title: 'Monto',
                dataIndex: 'amount',
                key: 'Monto',
                width: 100,
                ellipsis: true,
                className: 'ant-table-cell-link',
            }, {
                title: 'Metodo de pago',
                key: 'MetodoPago',
                render:(record) => methods_payments.filter(i => i.id === record.payment_method)[0]?.name,
                width: 150,
                ellipsis: true,
                className: 'ant-table-cell-link',
            }, {
                title: 'Estado',
                key: 'Estado',
                render: (record) => <Tag color={record.state === 'P' ? 'grey' : record.state === 'A' ? 'green' : 'red'}>{record.state === 'P' ? 'Pendiente' : record.state === 'A' ? 'Aprobado' : 'Rechazado'}</Tag>,
                width: 150,
                ellipsis: true,
            }, {
                title: 'Eliminado',
                key: 'eliminado',
                render: (record) => <Tag color={record.deleted_at ? 'red' : 'green'}>{record.deleted_at ? 'Si' : 'No'}</Tag>,
                width: 150,
                ellipsis: true,
            }, {
                title: '',
                key: 'actions',
                width: 150,
                render: record => (
                    <div style={{ width: '100%', textAlign: 'right' }}>
                        {/* {viewAll && <Button size='small' type='primary' onClick={e => onModalChangeState(record)} style={{ marginRight: 10 }}>Aprobar/Rechazar</Button>}&nbsp; */}
                        {record.document_name && <DownloadOutlined onClick={e => downloadDocument(record.document_name)} style={{ fontSize:18, marginRight: 10 }} title='Descargar documento' />}&nbsp;<EditOutlined onClick={e => onEditClick(record.id)} />
                    </div>
                ),
            }
        ];
    }

    const onModalChangeState = (record) => {
        Modal.info({
            width:500,
            title: 'Aprobar/Rechazar',
            okText: 'Cancelar',
            okType: 'default',
            loading: confirmLoading,
            content: (
                <div style={{marginBottom:15}}>
                    <div style={{marginTop:10}}>Pago correspondiente a <Tag>{dayjs(record.payment_day).format(DDMMYYYY)}</Tag></div>
                    <div style={{marginTop:10}}>Estado <Tag color={record.state === 'P' ? 'grey' : record.state === 'A' ? 'green' : 'red'}>{record.state === 'P' ? 'Pendiente' : record.state === 'A' ? 'Aprobado' : 'Rechazado'}</Tag></div>
                </div>
            ),
            footer: (
                <div style={{textAlign:'right'}}>
                    <Button type="primary" onClick={e => onChangeState(record.id, 'A')} style={{marginRight: 10 }}>Aprobar</Button> 
                    <Button type="primary" danger onClick={e => onChangeState(record.id, 'R')} style={{ marginRight: 20 }}>Rechazar</Button>
                    <Button onClick={e => Modal.destroyAll()} style={{ marginRight: 20 }}>Cancelar</Button>
                </div>
            )
        });
    };

    return (
        <Table
            loading={loading}
            columns={columns()}
            rowSelection={{ onChange: onRowSelectedChange, selectedRowKeys }}
            dataSource={data}
            footer={data => 
                <div>
                    <Button icon={<ReloadOutlined />} onClick={onReload} />
                    &nbsp;
                </div>}
            pagination={{
                style: paginationStyle,
                onChange: onPageChangeLocal,
                onShowSizeChange: onPageChangeLocal,
                pageSizeOptions: ['10', '50', '100'],
                showSizeChanger: true,
                showQuickJumper: false,
                hideOnSinglePage: false,
                size: 'normal',
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} elementos`,
                ...pagination,
            }}
            scroll={{ x: columns().map(a => a.width).reduce((b, c) => b + c), y: 'calc(100vh - 280px)' }}
            rowKey={record => record.getId()}
            onRow={r => ({ onDoubleClick: () => onEditClick(r.id) })}            
        />
    )
}


