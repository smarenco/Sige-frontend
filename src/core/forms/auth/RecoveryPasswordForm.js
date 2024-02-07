import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useForm } from '../../hooks/useForm';
import { recoveryPassword } from '../../services/AuthService';

const loginFormFields = {
  recoveryEmail: ''
}

const RecoveryPasswordForm = ({ handleError }) => {
  const { recoveryEmail, onInputChange: onLoginInputChange } = useForm(loginFormFields);

  const handleOnSubmit = async () => {
    try {
      const { response } = await recoveryPassword(recoveryEmail);
      message.success(response.message);
    }catch(err){
      handleError('Error en la autenticacion');
    }
  }

  return (
    <Form
      action='/auth/login'
      name="normal_login"
      className="reset-form"
      initialValues={{
        remember: true,
      }}
      onFinish={handleOnSubmit}
    >
      <Form.Item
        name="recoveryEmail"
        rules={[
          {
            required: true,
            message: 'Porfavor ingrese su correo electrónico!',
          },
        ]}
        >
        <Input
          name="recoveryEmail"
          onChange={onLoginInputChange}
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Correo Electrónico"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Recuperar Contraseña
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RecoveryPasswordForm;