

import { Form, Input, Checkbox } from 'antd'
import Loading from '../components/common/Loading'
import LayoutH from '../components/layout/LayoutH';

export const PaymentMethodsForm = ({ view, loading, confirmLoading, formState, onInputChange, onInputChangeByName }) => {

    
    return (
        loading ? <Loading /> : <Form layout='vertical'>
            <LayoutH>
                <Form.Item label={`${!view ? '*' : ''} Nombre`} labelAlign='left' span={14}>
                    <Input name='name' disabled={view || confirmLoading} onChange={onInputChange} value={formState?.name} />
                </Form.Item>
                <Form.Item labelAlign='left' span={5} style={{marginTop: 30}}>
                    <Checkbox name='online' disabled={view || confirmLoading} checked={formState?.online} onChange={(e) => onInputChangeByName('online', e.target.checked)}>Online</Checkbox>
                </Form.Item>
            </LayoutH>
        </Form>
    )
}