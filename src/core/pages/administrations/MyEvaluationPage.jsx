import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { alertError } from '../../common/functions';
import { myEvaluationsIndex } from '../../services/EvaluationService';
import { MyEvaluationCardList } from '../../tables/MyEvaluationCardList';

export const MyEvaluationsPage = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await myEvaluationsIndex();
            console.log(data);
            
            setData(data);
        } catch (err) {
            alertError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Card
            title={<strong>Mis evaluaciones</strong>}
            className="ant-section"
        >
            <MyEvaluationCardList
                data={data}
                loading={loading}
            />
        </Card>
    );
};
