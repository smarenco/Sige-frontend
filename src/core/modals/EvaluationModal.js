import {
    Modal,
    Tabs,
    Form,
    Input,
    Select,
    DatePicker,
    Checkbox,
    Button,
    Table,
    InputNumber,
    Space,
    message
} from 'antd';
import { groupCombo, groupShow } from '../services/GroupService';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const { TabPane } = Tabs;


export const EvaluationModal = ({
    open,
    item,
    onOk,
    onCancel,
    confirmLoading,
    loading
}) => {

    const [form] = Form.useForm();

    const [groups, setGroups] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    /* ===============================
       LOAD GROUPS
    =============================== */

    useEffect(() => {
        if (!open) return;

        loadGroups();
    }, [open]);

    const loadGroups = async () => {
        setLoadingGroups(true);
        try {
            const data = await groupCombo();
            setGroups(data);
        } catch (err) {
            message.error('Error cargando grupos');
        }
        setLoadingGroups(false);
    };

    /* ===============================
       INIT FORM
    =============================== */

    useEffect(() => {
        if (!open) return;

        form.setFieldsValue({
            name: item.name,
            group_id: item.group_id,
            date: item.date ? dayjs(item.date) : null,
            type: item.type,
            published: item?.published || item?.status === 'published' || false,
        });

        setQuestions(item?.questions || item?.scheme?.questions || []);

        if (item.group_id) {
            loadGroupStudents(item.group_id, true);
        }

    }, [open]);

    /* ===============================
       GROUP → STUDENTS
    =============================== */

    const loadGroupStudents = async (groupId, keepSelection = false) => {
        try {
            const group = await groupShow(groupId);

            const groupStudents = group.students || [];
            setStudents(groupStudents);
            

            setSelectedStudents(item.students.filter(s => s.has_evaluation).map(s => s.id));
        } catch (err) {
            message.error('Error cargando estudiantes del grupo');
        }
    };

    const onGroupChange = (groupId) => {
        form.setFieldValue('group_id', groupId);
        loadGroupStudents(groupId);
    };

    /* ===============================
       QUESTIONS
    =============================== */

    const addQuestion = () => {
        setQuestions([...questions, { title: '', max_score: 0 }]);
    };

    const updateQuestion = (index, field, value) => {
        const copy = [...questions];
        copy[index][field] = value;
        setQuestions(copy);
    };

    const removeQuestion = (index) => {
        const copy = [...questions];
        copy.splice(index, 1);
        setQuestions(copy);
    };

    const totalScore = questions.reduce(
        (sum, q) => sum + Number(q.max_score || 0), 0
    );

    /* ===============================
       SUBMIT
    =============================== */

    const handleOk = async () => {
        const values = await form.validateFields();

        onOk({
            ...item,
            ...values,
            date: values.date?.format('YYYY-MM-DD'),
            questions,
            student_ids: selectedStudents,
        });
    };

    /* ===============================
       TABLES
    =============================== */

    const questionColumns = [
        {
            title: 'Pregunta',
            render: (_, r, i) => (
                <Input
                    value={r.title}
                    onChange={e => updateQuestion(i, 'title', e.target.value)}
                />
            ),
        },
        {
            title: 'Puntaje',
            width: 120,
            render: (_, r, i) => (
                <InputNumber
                    min={0}
                    value={r.max_score}
                    onChange={v => updateQuestion(i, 'max_score', v)}
                />
            ),
        },
        {
            title: '',
            width: 80,
            render: (_, __, i) => (
                <Button danger onClick={() => removeQuestion(i)}>
                    Quitar
                </Button>
            ),
        },
    ];

    const studentColumns = [
        {
            title: 'Nombre',
            render: r => `${r.names} ${r.lastnames}`,
        },
        {
            title: 'Documento',
            dataIndex: 'document',
        },
    ];

    /* ===============================
       RENDER
    =============================== */

    return (
        <Modal
            open={open}
            title="Evaluación"
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={confirmLoading}
            width={900}
            destroyOnClose
        >
            <Tabs defaultActiveKey="1">

                {/* GENERAL */}
                <TabPane tab="General" key="1">
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Nombre"
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Grupo"
                            name="group_id"
                            rules={[{ required: true }]}
                        >
                            <Select
                                loading={loadingGroups}
                                onChange={onGroupChange}
                                options={groups.map(g => ({
                                    value: g.id,
                                    label: g.name
                                }))}
                            />
                        </Form.Item>

                        <Form.Item label="Fecha" name="date">
                            <DatePicker />
                        </Form.Item>

                        <Form.Item label="Tipo" name="type">
                            <Select
                                options={[
                                    { value: 'exam', label: 'Examen' },
                                    { value: 'test', label: 'Prueba' },
                                    { value: 'assignment', label: 'Trabajo' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="published"
                            valuePropName="checked"
                        >
                            <Checkbox>Publicada</Checkbox>
                        </Form.Item>
                    </Form>
                </TabPane>

                {/* SCHEMA */}
                <TabPane tab="Esquema de evaluación" key="2">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button type="dashed" onClick={addQuestion}>
                            Agregar pregunta
                        </Button>

                        <Table
                            dataSource={questions}
                            columns={questionColumns}
                            pagination={false}
                            rowKey={(_, i) => i}
                        />

                        <strong>Total: {totalScore} puntos</strong>
                    </Space>
                </TabPane>

                {/* STUDENTS */}
                <TabPane tab="Estudiantes" key="3">
                    <Table
                        dataSource={students}
                        columns={studentColumns}
                        rowKey="id"
                        rowSelection={{
                            selectedRowKeys: selectedStudents,
                            onChange: setSelectedStudents
                        }}
                        pagination={false}
                    />
                </TabPane>

            </Tabs>
        </Modal>
    );
};
