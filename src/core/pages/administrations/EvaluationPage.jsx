import { Button, Card, Dropdown, Menu, Modal, Space, message } from 'antd';
import { useEffect, useState } from 'react';

import {
    AppstoreAddOutlined,
    BranchesOutlined,
    CloudUploadOutlined,
    DownOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    FileTextOutlined,
    ImportOutlined
} from '@ant-design/icons';

import { alertError, renderError } from '../../common/functions';

import Evaluation from '../../models/Evaluation';

import {
    evaluationIndex,
    evaluationShow,
    evaluationCreate,
    evaluationUpdate,
    evaluationDelete,
    evaluationPublish,
    submitCorrections,
    // importEvaluations
} from '../../services/EvaluationService';

import { EvaluationTable } from '../../tables/EvaluationTable';
import { EvaluationModal } from '../../modals/EvaluationModal';
import { EvaluationCorrectionModal } from '../../modals/EvaluationCorrectionModal';
// import { ImportEvaluationsModal } from '../../modals/ImportEvaluationsModal';

export const EvaluationPage = ({ app }) => {
    const [openCorrectionModal, setOpenCorrectionModal] = useState(false);
    const [correctionItem, setCorrectionItem] = useState(null);

    const [item, setItem] = useState(new Evaluation());
    const [filters, setFilters] = useState({});
    const [data, setData] = useState([]);
    const [dataPage, setDataPage] = useState({ page: 1, pageSize: 50 });
    const [total, setTotal] = useState(0);
    const [rowSelected, setRowSelected] = useState({ selectedRowKeys: [], selectedRows: [] });

    const [openModal, setOpenModal] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [importState, setImportState] = useState(undefined);

    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { page, pageSize } = dataPage;
    const { selectedRowKeys } = rowSelected;

    /* =======================
       EXPORT
    ======================= */

    const exportItems = [
        {
            label: 'Excel',
            key: 'xls',
            icon: <FileExcelOutlined />,
            onClick: () => evaluationIndex(filters, 'xls')
        },
        {
            label: 'PDF',
            key: 'pdf',
            icon: <FilePdfOutlined />,
            onClick: () => evaluationIndex(filters, 'pdf')
        },
        {
            label: 'CSV',
            key: 'csv',
            icon: <FileTextOutlined />,
            onClick: () => evaluationIndex(filters, 'csv')
        }
    ];

    /* =======================
       HEADER ACTIONS
    ======================= */

    const renderExtraTable = () => (
        <>
            <Button
                icon={<ImportOutlined />}
                style={{ marginRight: 15 }}
                type="default"
                disabled={loading}
                onClick={() => setOpenImportModal(true)}
            >
                Importar
            </Button>

            <Dropdown menu={{ items: exportItems }} disabled={loading}>
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        Exportar <DownOutlined />
                    </Space>
                </a>
            </Dropdown>

            <Button.Group style={{ marginLeft: 15 }}>
                <Button
                    onClick={() => {
                        setItem(new Evaluation());
                        setOpenModal(true);
                    }}
                    disabled={loading}
                >
                    Nuevo
                </Button>

                <Button
                    onClick={() => loadItem(selectedRowKeys[0])}
                    disabled={loading || selectedRowKeys.length !== 1}
                >
                    Editar
                </Button>
            </Button.Group>

            <Button
                style={{ marginLeft: 15 }}
                danger
                ghost
                disabled={loading || selectedRowKeys.length === 0}
                onClick={onDelete}
            >
                Eliminar
            </Button>

            <Button
                style={{ marginLeft: 15 }}
                icon={<CloudUploadOutlined />}
                disabled={loading || selectedRowKeys.length === 0}
                onClick={onPublish}
            >
                Publicar
            </Button>
        </>
    );

    /* =======================
       DATA HANDLERS
    ======================= */

    const loadData = async (pageParam = page, pageSizeParam = pageSize) => {
        setLoading(true);
        try {
            const { data, total } = await evaluationIndex({
                page: pageParam,
                pageSize: pageSizeParam,
                ...filters
            });
            console.log(data);
            
            setData(data);
            setTotal(total);
            setRowSelected({ selectedRowKeys: [], selectedRows: [] });
        } catch (err) {
            alertError(err);
        }
        setLoading(false);
    };

    const loadItem = async (id) => {
        setLoading(true);
        try {
            const response = await evaluationShow(id);
            setItem(response);
            setOpenModal(true);
        } catch (err) {
            renderError(err);
        }
        setLoading(false);
    };

    const onDelete = () => {
        Modal.confirm({
            title: 'Eliminar evaluaciones',
            okType: 'danger',
            okText: 'Eliminar',
            cancelText: 'Cancelar',
            content: `¿Seguro que desea eliminar ${selectedRowKeys.length} registro(s)?`,
            onOk: async () => {
                setLoading(true);
                try {
                    await evaluationDelete(selectedRowKeys);
                    loadData();
                } catch (err) {
                    renderError(err);
                }
                setLoading(false);
            }
        });
    };

    const onPublish = () => {
        Modal.confirm({
            title: 'Publicar evaluaciones',
            okType: 'primary',
            okText: 'Publicar',
            cancelText: 'Cancelar',
            content: `¿Seguro que desea publicar ${selectedRowKeys.length} registro(s)?`,
            onOk: async () => {
                setLoading(true);
                try {
                    await evaluationPublish(selectedRowKeys);
                    loadData();
                } catch (err) {
                    renderError(err);
                }
                setLoading(false);
            }
        });
    };

    /* =======================
       MODALS
    ======================= */

    const onModalOk = async (obj) => {
        setConfirmLoading(true);
        try {
            if (obj.id) {
                await evaluationUpdate(obj.id, obj);
            } else {
                await evaluationCreate(obj);
            }

            setOpenModal(false);
            loadData();
        } catch (err) {
            renderError(err);
        }
        setConfirmLoading(false);
    };

    const onImportModalOk = async (file) => {
        setConfirmLoading(true);
        try {
            // TODO: habilitar cuando la parte de importacion del servicio esté listo
            // const { response } = await importEvaluations(file);

            // if (response?.data?.error?.length) {
            //     setImportState(response.data);
            // } else {
            //     setOpenImportModal(false);
            //     message.success('Evaluaciones importadas correctamente');
            //     loadData();
            // }
        } catch (err) {
            renderError(err);
        }
        setConfirmLoading(false);
    };

    /* =======================
       EFFECT
    ======================= */

    useEffect(() => {
        loadData();
    }, []);

    /* =======================
       RENDER
    ======================= */

    return (
        <>
            <Card
                title={<strong>Evaluaciones</strong>}
                className="ant-section"
                extra={renderExtraTable()}
            >
                <EvaluationTable
                    data={data}
                    loading={loading}
                    selectedRowKeys={selectedRowKeys}
                    onRowSelectedChange={(keys, rows) =>
                        setRowSelected({ selectedRowKeys: keys, selectedRows: rows })
                    }
                    setFilters={setFilters}
                    onPageChange={(page, pageSize) => {
                        setDataPage({ page, pageSize });
                        loadData(page, pageSize);
                    }}
                    onReload={loadData}
                    pagination={{
                        page,
                        pageSize,
                        total
                    }}
                    onEditClick={loadItem}
                    onCorrectClick={(evaluation) => {
                        setCorrectionItem(evaluation);
                        setOpenCorrectionModal(true);
                    }}
                />
            </Card>
            
            <EvaluationModal
                app={app}
                open={openModal}
                item={item}
                onOk={onModalOk}
                confirmLoading={confirmLoading}
                loading={loading}
                onCancel={() => {
                    setOpenModal(false);
                    setItem(new Evaluation());
                }}
            />

            <EvaluationCorrectionModal
                open={openCorrectionModal}
                evaluation={correctionItem}
                onCancel={() => {
                    setOpenCorrectionModal(false);
                    setCorrectionItem(null);
                }}
                onOk={async (payload) => {
                    await submitCorrections(correctionItem.id, payload);
                    setOpenCorrectionModal(false);
                    setCorrectionItem(null);
                    loadData();
                    message.success('Correcciones guardadas correctamente');
                }}
            />

            {/* TODO: habilitar cuando la parte de importacion del servicio esté listo */}
            {/* <ImportEvaluationsModal
                app={app}
                open={openImportModal}
                importState={importState}
                onOk={onImportModalOk}
                confirmLoading={confirmLoading}
                loading={loading}
                onCancel={() => {
                    setOpenImportModal(false);
                    setImportState(undefined);
                }}
            /> */}
        </>
    );
};
