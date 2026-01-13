import { Card, Tag, Typography, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const statusConfig = {
    closed: { color: 'green', label: 'Corregida' },
    upcoming: { color: 'blue', label: 'Próximamente' },
    pending: { color: 'orange', label: 'Pendiente' }
};

export const MyEvaluationCardList = ({ data, loading }) => {

    if (!data?.length && !loading) {
        return (
            <Card>
                <Text type="secondary" style={{padding: 20, textAlign: 'center', display: 'block'}}>
                    No hay evaluaciones disponibles.
                </Text>
            </Card>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: 10 }}>
            {data.map(ev => {
                const status = statusConfig[ev.status] || statusConfig.pending;

                return (
                    <Card
                        key={ev.id}
                        size="small"
                        loading={loading}
                        bodyStyle={{ margin: 14 }}
                    >
                        {/* TÍTULO */}
                        <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
                            {ev.name}
                        </Title>

                        {/* INFO */}
                        <Row gutter={[8, 6]}>
                            <Col span={24}>
                                <Text type="secondary">
                                    Grupo: <strong>{ev.group}</strong>
                                </Text>
                            </Col>

                            <Col span={12}>
                                <Text>
                                    Fecha:{' '}
                                    <strong>
                                        {dayjs(ev.date).format('DD/MM/YYYY')}
                                    </strong>
                                </Text>
                            </Col>

                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Tag color={status.color}>
                                    {status.label}
                                </Tag>
                            </Col>

                            <Col span={24}>
                                <Text>
                                    Nota:{' '}
                                    <strong>
                                        {ev.score !== null ? ev.score : '—'}
                                    </strong>
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                );
            })}
        </div>
    );
};
