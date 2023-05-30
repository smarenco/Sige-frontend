import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { renderError } from '../common/functions';
import { AccountPaymentForm } from '../forms/AccountPaymentForm';
import { useForm } from '../hooks/useForm';

export const AccountPaymentModal = (props) => {

    const { view, app, open, item, onOk: onOkProp, loading, confirmLoading, onCancel: onCancelProp } = props;
  
    const { formState, onInputChange, onInputChangeByName } = useForm(item);    

    const onOk = () => {
        
        
        if(!formState.reference || formState.reference.trim().length === 0){
            renderError('Debe ingresar la referencia');
            return;
        }
        if(!formState.amount || formState.amount.length === 0){
            renderError('Debe ingresar el monto');
            return;
        }
        if(!formState.payment_day || formState.payment_day.length === 0){
            renderError('Debe ingresar el dia de pago');
            return;
        }
        if(!formState.payment_method || formState.payment_method.trim().length === 0){
            renderError('Debe ingresar el metodo de pago');
            return;
        }
        onOkProp(formState);
    }

    const onCancel = () => {
        onCancelProp();
    }

    return (
        <Modal
            bodyStyle={{ paddingTop: 10}}
            title={`${view ? 'Detalle' : item.getId() ? 'Editar' : 'Nuevo registro'}`}
            open={open}
            width={750}
            destroyOnClose={true}
            okText='Guardar'
            cancelText='Cancelar'
            cancelButtonProps={{ disabled: confirmLoading }}
            loading={loading}
            onOk={onOk}
            maskClosable={false}
            closable={!confirmLoading}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            okButtonProps={{disabled: view}}>

            <AccountPaymentForm
                app={app}
                view={view}
                formState={formState}
                onInputChange={onInputChange}
                onInputChangeByName={onInputChangeByName}
                onCancel={onCancel}
            />
        </Modal>
    );
}