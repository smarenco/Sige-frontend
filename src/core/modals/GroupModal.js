import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { renderError, validatorInputsRequired } from '../common/functions';
import { GroupForm } from '../forms/GroupForm';
import { useForm } from '../hooks/useForm';

export const GroupModal = (props) => {

    const [ready, setReady] = useState(false)

    const { view, app, open, item, onOk: onOkProp, loading, confirmLoading, onCancel: onCancelProp } = props;
  
    const { formState, onInputChange, onInputChangeByName } = useForm(item);    

    const onOk = () => {
        
        const inputs = [
            { name: 'name', text: 'Debe ingresar el nombre'},
            { name: 'turn_id', text: 'Debe seleccionar un turno'},
            { name: 'course_id', text: 'Debe seleccionar un curso'},
            { name: 'institute_id', text: 'Debe seleccionar un instituto'},
            { name: 'number_students', text: 'Debe ingresar la cantidad de cupos'},
            { name: 'start_date', text: 'Debe ingresar la fecha inicial'},
            { name: 'finish_date', text: 'Debe ingresar la fecha final'},
        ];

        if(validatorInputsRequired(formState, inputs)){
            onOkProp(formState);
        }
    }

    const onCancel = () => {
        onCancelProp();
    }

    return (
        <Modal
            bodyStyle={{ paddingTop: 10, height: '75vh'}}
            title={`${view ? 'Detalle' : item.getId() ? 'Editar' : 'Nuevo registro'}`}
            open={open}
            style={{top: 10}}
            width='100vw'
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

            <GroupForm
                app={app}
                view={view}
                formState={formState}
                loading={loading}
                confirmLoading={confirmLoading}
                onInputChange={onInputChange}
                onInputChangeByName={onInputChangeByName}
                onCancel={onCancel}
            />
        </Modal>
    );
}
