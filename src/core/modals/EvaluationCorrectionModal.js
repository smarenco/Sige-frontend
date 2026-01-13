import {
    Modal,
    Tabs,
    Row,
    Col,
    InputNumber,
    Card,
    Typography,
    Divider,
    Progress,
    message
} from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { renderError } from '../common/functions';
import { submitCorrections } from '../services/EvaluationService';

const { Text } = Typography;

export const EvaluationCorrectionModal = ({
    open,
    evaluation,
    onCancel,
    onOk: onPropOk,
    confirmLoading
}) => {

    const students = evaluation?.students || [];
    const questions = evaluation?.scheme?.questions || [];

    const [activeStudentId, setActiveStudentId] = useState(null);
    const [allResults, setAllResults] = useState({});
    const [loading, setLoading] = useState(false);

    /* ======================
       INIT
    ====================== */

    useEffect(() => {
        if (students.length) {
            setActiveStudentId(students[0].id);
        }
    }, [students]);

    /* ======================
       HELPERS
    ====================== */

    const getStudentScores = (studentId) => {
        return allResults[studentId] || {};
    };

    const isStudentCompleted = (studentId) => {
        const scores = getStudentScores(studentId);
        return questions.every(q => scores[q.id] !== undefined);
    };

    const completedCount = students.filter(s => isStudentCompleted(s.id)).length;

    /* ======================
       HANDLERS
    ====================== */

    const updateScore = (studentId, questionId, value) => {
        setAllResults(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                [questionId]: value
            }
        }));
    };

    const onOk = async () => {
        try {
            setLoading(true);

            const questions = evaluation.scheme.questions;

            const results = Object.entries(allResults).map(
                ([student_id, answers]) => ({
                    student_id: Number(student_id),
                    answers: questions.map((q) => ({
                        question_id: q.id,
                        max_score:
                            answers && answers[q.id] !== undefined
                                ? answers[q.id]
                                : null
                    }))
                })
            );

            await onPropOk({ results });

        } catch (err) {
            renderError(err);
        } finally {
            setLoading(false);
        }
    };

    /* ======================
       RENDER
    ====================== */

    return (
        <Modal
            title={`Corrección - ${evaluation?.name}`}
            open={open}
            width={900}
            onOk={onOk}
            onCancel={onCancel}
            confirmLoading={confirmLoading || loading}
            okText="Guardar correcciones"
            cancelText="Cancelar"
            destroyOnClose
            maskClosable={false}
        >
            {/* PROGRESO */}
            <div style={{ marginBottom: 16 }}>
                <Text strong>
                    Corrigiendo {completedCount} de {students.length} estudiantes
                </Text>
                <Progress
                    percent={students.length ? Math.round((completedCount / students.length) * 100) : 0}
                    size="small"
                />
            </div>

            <Divider />

            <Tabs
                activeKey={String(activeStudentId)}
                onChange={key => setActiveStudentId(Number(key))}
                type="card"
                items={students.map(student => ({
                    key: String(student.id),
                    label: (
                        <span>
                            {isStudentCompleted(student.id)
                                ? <CheckCircleOutlined style={{ color: 'green' }} />
                                : <ClockCircleOutlined style={{ color: '#faad14' }} />
                            }
                            &nbsp;{student.names} {student.lastnames}
                        </span>
                    ),
                    children: (
                        <>
                            {questions.map(q => (
                                <Card
                                    key={q.id}
                                    size="small"
                                    style={{ marginBottom: 8 }}
                                >
                                    <Row align="middle">
                                        <Col span={14}>
                                            <Text>{q.title}</Text>
                                        </Col>

                                        <Col span={4}>
                                            <Text type="secondary">
                                                Máx: {q.max_score}
                                            </Text>
                                        </Col>

                                        <Col span={6}>
                                            <InputNumber
                                                min={0}
                                                max={q.max_score}
                                                style={{ width: '100%' }}
                                                value={getStudentScores(student.id)[q.id]}
                                                onChange={v =>
                                                    updateScore(student.id, q.id, v)
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </>
                    )
                }))}
            />
        </Modal>
    );
};
