import { Modal } from 'antd';
import RecoveryPasswordForm from '../../forms/auth/RecoveryPasswordForm';
import ResetPasswordForm from '../../forms/auth/ResetPasswordForm';
import './LoginPage.css';

export const ResetPasswordPage = ({type}) => {
    const error = (title, content) => {
        Modal.error({
            title,
            content,
        });
    };

    return (
        <div className='login-background'>
            <div className='login-modal'>
                <h2 style={{width: '100%', marginTop: 20, textAlign: 'center'}}>Ingrese su correo electrónico para recuperar contraseña</h2>
                {
                    type === 'recovery' ?
                    <RecoveryPasswordForm style={{}} handleError={error} />
                    :
                    <ResetPasswordForm handleError={error} />
                }
                    
            </div>
            <div className='login-cover'>
            <span>.</span>
            </div>
        </div>
    )
}