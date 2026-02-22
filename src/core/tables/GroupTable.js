import { Button, Checkbox, Input, Table } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { DDMMYYYY } from '../common/consts';
import dayjs from 'dayjs';


const paginationStyle = {
    marginRight: 24,
    marginLeft: 24,
    marginBottom: 0,
    position: 'absolute',
    bottom: 11,
    right: 0,
};

export const GroupTable = ({ data, onReload, onRowSelectedChange, setFilters, selectedRowKeys, loading, onPageChange, pagination, onEditClick: onEdit, comeUserForm = false }) => {

    const onPageChangeLocal = (page, pageSize) => {
        onPageChange(page, pageSize);
    }
    
    const onEditClick = (id) => {
        onEdit(id);
    }
    
    const columns = () => {
        return [
            {
                title: 'Nombre',
                key: 'Nombre',
                width: 210,
                ellipsis: true,
                render: r => <Button type='link' onClick={e => onEditClick(r.id)}>{r.name}</Button>,
                className: 'ant-table-cell-link',
            }, {
                title: 'Cant. Estudiantes',
                key: 'cant_students',
                dataIndex: 'number_students',
                width: 145,
                render: r => <span style={{fontWeight: 'bold'}}>{r}</span>,
                className: 'ant-table-cell-link',
            }, {
                title: 'Curso',
                dataIndex: 'course_name',
                key: 'Curso',
                width: 200,
                ellipsis: true,
            }, {
                title: 'Instituto',
                dataIndex: 'institute_name',
                key: 'Instituto',
                width: 180,
                ellipsis: true,
            }, {
                title: 'Turno',
                dataIndex: 'turn_name',
                key: 'Turno',
                width: 150,
                ellipsis: true,
            }, {
                title: 'Desde',
                key: 'Desde',
                width: 110,
                render: (r) => dayjs(r.start_date).format(DDMMYYYY),
                ellipsis: true,
            }, {
                title: 'Hasta',
                key: 'Hasta',
                width: 110,
                render: (r) => dayjs(r.finish_date).format(DDMMYYYY),
                ellipsis: true,
            }, {
                title: '',
                key: 'actions',
                width: 100,
                render: record => (
                    !comeUserForm && <div style={{ width: '100%', textAlign: 'right' }}>
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
            rowSelection={!comeUserForm && { onChange: onRowSelectedChange, selectedRowKeys }}
            dataSource={data}
            footer={data => 
                !comeUserForm && <div>
                    <Button icon={<ReloadOutlined />} onClick={onReload} />
                    &nbsp;
                    <Input style={{width: '20%'}} placeholder='Buscar...' className='search-form' onChange={e => setFilters({ Search: e.target.value })} /> 
                    &nbsp;
                    <Checkbox onChange={e => setFilters({ ShowDeleted: e.target.checked }, onReload)}>Ver eliminados</Checkbox>
                </div>}
            pagination={!comeUserForm && {
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
            scroll={{ x: columns().map(a => a.width).reduce((b, c) => b + c), y: 'calc(65vh)' }}
            rowKey={record => record.getId()}
            onRow={r => !comeUserForm && ({ onDoubleClick: () => onEditClick(r.id) })}
            
        />
    )
}


