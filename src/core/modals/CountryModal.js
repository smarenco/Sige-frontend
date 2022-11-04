import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { renderError } from '../common/functions';
import { CountryForm } from '../foms/CountryForm';

export const CountryModal = (props) => {

    const [ready, setReady] = useState(false)

    const { view, app, open, item, onOk: onOkProp, confirmLoading, onCancel: onCancelProp } = props;
  
    const [ formState, onInputChange ] = useState(item);

    useEffect(() => {
        onInputChange(item);
    }, [item])
    

    const onOk = () => {
        
        if(!formState.Nombre || formState.Nombre.trim().length === 0){
            renderError('Debe ingresar el nombre');
            return;
        }

        onOkProp(formState);
    }

    const onCancel = () => {
        onCancelProp();
    }

    return (
        <Modal
            title={`${view ? 'Detalle' : item.getId() ? 'Editar' : 'Nuevo registro'}`}
            open={open}
            width={900}
            destroyOnClose={true}
            okText='Guardar'
            cancelText='Cancelar'
            cancelButtonProps={{ disabled: confirmLoading }}
            loading={confirmLoading}
            onOk={onOk}
            maskClosable={false}
            closable={!confirmLoading}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            okButtonProps={{disabled: view}}>

            <CountryForm
                app={app}
                view={view}
                formState={formState}
                onInputChange={onInputChange}
                onCancel={onCancel}
            />
        </Modal>
    );
}