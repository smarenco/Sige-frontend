import { Modal } from 'antd'
import React from 'react'
import { validatorInputsRequired } from '../common/functions';
import { UserForm } from '../forms/UserForm';
import { useForm } from '../hooks/useForm';

export const UserModal = (props) => {

    const { view, app, open, item, onOk: onOkProp, loading, confirmLoading, onCancel: onCancelProp } = props;
  
    const { formState, onInputChange, onInputChangeByName } = useForm(item); 

    const onOk = () => {
        
        const inputs = [
            { name: 'document', text: 'Debe ingresar un documento'},
            { name: 'names', text: 'Debe seleccionar un nombre'},
            { name: 'lastnames', text: 'Debe ingresar un apellido'},
            { name: 'birth_day', text: 'Debe ingresar una fecha de nacimiento'},
            { name: 'gender', text: 'Debe seleccionar un genero'},
            { name: 'country_id', text: 'Debe seleccionar un pais'},
            { name: 'city_id', text: 'Debe seleccionar un ciudad'},
            { name: 'location', text: 'Debe ingresar una localidad'},
            { name: 'cell_phone', text: 'Debe ingresar un telefono'},
            { name: 'email', text: 'Debe ingresar un email'},
            { name: 'medical_coverage_id', text: 'Debe seleccionar una cobertura medica'},
            { name: 'type', text: 'Debe seleccionar un tipo de usuario'},
            { name: 'education_level', text: 'Debe seleccionar un nivel educativo'},
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
            bodyStyle={{ paddingTop: 10}}
            title={`${view ? 'Detalle' : item.getId() ? 'Editar' : 'Nuevo registro'}`}
            open={open}
            width={1100}
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

            <UserForm
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
