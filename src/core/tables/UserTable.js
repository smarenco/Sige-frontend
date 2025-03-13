import { Button, Checkbox, Input, Select, Table, Tag } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { loadTypes } from '../common/functions';


const paginationStyle = {
    marginRight: 24,
    marginLeft: 24,
    marginBottom: 0,
    position: 'absolute',
    bottom: 11,
    right: 0,
};

export const UserTable = ({ data, onReload, onRowSelectedChange, setFilters, selectedRowKeys, loading, onPageChange, pagination, onEditClick: onEdit, userTypes }) => {

    const onPageChangeLocal = (page, pageSize) => {
        onPageChange(page, pageSize);
    }
    
    const onEditClick = (id) => {
        onEdit(id);
    }
    
    const columns = () => {
        return [
            {
                title: 'Documento',
                dataIndex: 'document',
                key: 'Documento',
                width: 130,
                ellipsis: true,
                className: 'ant-table-cell-link',
            }, {
                title: 'Nombre',
                render: (record) => record.names + ' ' + record.lastnames ,
                key: 'Nombre',
                width: 150,
                ellipsis: true,
            }, {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 200,
                ellipsis: true,
            }, {
                title: 'Tipo',
                key: 'Tipo',
                width: 120,
                ellipsis: true,
                render: (record) => {
                    const tipos = loadTypes(record.gender.toLowerCase());
                    return tipos.filter(tipo => record.type.toLowerCase() === tipo.id)[0]?.name || 'indefinido';
                },
            }, {
                title: 'Estado',
                key: 'Estado',
                render: (record) => <Tag color={record.state ? 'green' : 'red'}>{record.state ? 'Activo' : 'Inactivo'}</Tag>,
                width: 80,
                ellipsis: true,
            }, {
                title: '',
                key: 'actions',
                width: 80,
                render: record => (
                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <EditOutlined onClick={e => onEditClick(record.id)} />
                    </div>
                ),
            }
        ];
    }

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
                    <Input style={{width: '20%'}} placeholder='Buscar...' className='search-form' onChange={e => setFilters({ Search: e.target.value })} /> 
                    &nbsp;
                    <Select allowClear style={{width: '20%'}} placeholder='Tipos de usuario...' onChange={UserType => setFilters({ UserType })}>
                        {userTypes.map(type => <Select.Option key={type.id} value={type.id}>{type.name}</Select.Option>)}
                    </Select>
                    &nbsp; 
                    <Checkbox onChange={e => setFilters({ ShowDeleted: e.target.checked }, onReload)}>Ver eliminados</Checkbox>
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


