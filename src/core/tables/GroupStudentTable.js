import { Button, Checkbox, Input, Select, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';

export const GroupStudentTable = ({ data, onDeleteStudent }) => {

    const columns = () => {
        return [
            {
                title: 'Documento',
                dataIndex: 'document',
                key: 'Documento',
                width: 250,
                ellipsis: true,
                className: 'ant-table-cell-link',
            }, {
                title: 'Nombre',
                render: (record) => record.names + ' ' + record.lastnames,
                key: 'Nombre',
                width: 250,
                ellipsis: true,
            }, {
                title: 'Telefono',
                dataIndex: 'contact_phone',
                key: 'Telefono',
                width: 150,
                ellipsis: true,
            }, {
                title: '',
                key: 'actions',
                width: 100,
                render: record => (
                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <DeleteOutlined onClick={e => onDeleteStudent(record.id)} />
                    </div>
                ),
            }
        ];
    }

    return (
        <Table
            columns={columns()}
            dataSource={[ ...data ]}
            scroll={{ x: columns().map(a => a.width).reduce((b, c) => b + c), y: '440px' }}
            rowKey={record => record.id}
            pagination={false}
        />
    )
}


