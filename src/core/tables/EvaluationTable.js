import { Button, Checkbox, Input, Space, Table, Tag } from "antd";
import {
  EditOutlined,
  FileDoneOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { DDMMYYYY } from "../common/consts";
import dayjs from "dayjs";
import { render } from "@testing-library/react";

const paginationStyle = {
  marginRight: 24,
  marginLeft: 24,
  marginBottom: 0,
  position: "absolute",
  bottom: 11,
  right: 0,
};

export const EvaluationTable = ({
  data,
  onReload,
  onRowSelectedChange,
  setFilters,
  selectedRowKeys,
  loading,
  onPageChange,
  pagination,
  onEditClick: onEdit,
  onCorrectClick,
  comeUserForm = false,
}) => {
  const onPageChangeLocal = (page, pageSize) => {
    onPageChange(page, pageSize);
  };

  const onEditClick = (id) => {
    onEdit(id);
  };

  const columns = () => [
    {
      title: "Nombre",
      key: "Nombre",
      width: 220,
      ellipsis: true,
      render: (r) => (
        <Button type="link" onClick={() => onEditClick(r.id)}>
          {r.name}
        </Button>
      ),
      className: "ant-table-cell-link",
    },
    {
      title: "Grupo",
      key: "Grupo",
      width: 180,
      ellipsis: true,
      render: (_, record) => record.group?.name || "",
    },
    {
      title: "Curso",
      key: "Curso",
      ellipsis: true,
      render: (_, record) => record.group?.course?.name || "",
    },
    {
      title: "Instituto",
      key: "Instituto",
      ellipsis: true,
      render: (_, record) => record.group?.institute?.name || "",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "Tipo",
      ellipsis: true,
    },
    {
      title: "Fecha",
      key: "Fecha",
      width: 120,
      render: (r) => dayjs(r.date).format(DDMMYYYY),
      ellipsis: true,
    },
    {
      title: "Publicada",
      key: "Publicada",
      width: 120,
      render: (r) =>
        r.status === 'published' ? (
          <Tag color="green">Sí</Tag>
        ) : (
          <Tag color="volcano">No</Tag>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      render: (record) =>
        !comeUserForm && (
          <Space size="small" style={{ float: "right" }}>
            <Button
              type="link"
              size="small"
              disabled={record.status !== 'published'}
              icon={<FileDoneOutlined />}
              onClick={() => onCorrectClick(record)}
            >
              Corregir
            </Button>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEditClick(record.id)}
            >
              Editar
            </Button>
          </Space>
        ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns()}
      dataSource={data}
      rowKey={(record) => record.getId()}
      rowSelection={
        !comeUserForm && {
          onChange: onRowSelectedChange,
          selectedRowKeys,
        }
      }
      footer={() =>
        !comeUserForm && (
          <div>
            <Button icon={<ReloadOutlined />} onClick={onReload} />
            &nbsp;
            <Input
              style={{ width: "20%" }}
              placeholder="Buscar..."
              className="search-form"
              onChange={(e) => setFilters({ Search: e.target.value })}
            />
            &nbsp;
            <Checkbox
              onChange={(e) => setFilters({ ShowDeleted: e.target.checked })}
            >
              Ver eliminadas
            </Checkbox>
          </div>
        )
      }
      pagination={
        !comeUserForm && {
          style: paginationStyle,
          onChange: onPageChangeLocal,
          onShowSizeChange: onPageChangeLocal,
          pageSizeOptions: ["10", "50", "100"],
          showSizeChanger: true,
          showQuickJumper: false,
          hideOnSinglePage: false,
          size: "normal",
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} elementos`,
          ...pagination,
        }
      }
      scroll={{
        x: columns()
          .map((c) => c.width)
          .reduce((a, b) => a + b),
        y: "calc(100vh - 280px)",
      }}
      onRow={(r) =>
        !comeUserForm && {
          onDoubleClick: () => onEditClick(r.id),
        }
      }
    />
  );
};
