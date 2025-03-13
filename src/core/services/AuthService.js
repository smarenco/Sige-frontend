import api from "./Api";
import { ACCESS_TOKEN, CONFIG, MENU, PARAMS, SESSION, USER } from "../common/consts";
import User from "../models/User";
import { Modal } from "antd";

export const resetPassword = (token, new_password, repeat_password) => {
    return api
        .post('auth/reset-password', {
            token,
            new_password,
            repeat_password,
        });
}

export const recoveryPassword = (username) => api.post('auth/recovery-password', { username });

export const login = async (username, password) => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(SESSION);
    localStorage.removeItem(CONFIG);
    try {
        const { response } = await api.post('/auth/login', { username, password })
        localStorage.setItem(ACCESS_TOKEN, response.data.token);
        api.defaults.headers.common['X-US-AUTH-TOKEN'] = response.data.token;
        localStorage.setItem('token-init-date', new Date().getTime());
        localStorage.setItem(USER, JSON.stringify(response.data.user));
        localStorage.setItem(MENU, JSON.stringify(response.data.menu));
        if (response.menu?.length > 0) {
            let menu = response.menu;
            localStorage.setItem(MENU, JSON.stringify(menu));
        }
        window.location.href = '/';
    } catch({ status, response }) {
        if (status !== 200) {
            Modal.error({
                title: 'Error al iniciar sesión, por favor verificar correo electrónico y/o contraseña',
                content: <p>{response?.error}</p>,
                okText: 'Aceptar',
            });
        }
    }
}

/**
 * Inicia sesión a partir de un token de acceso
 * @param {string} token 
 */
export const loginByToken = token => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(SESSION);
    localStorage.removeItem(CONFIG);
    return api
        .post('auth/login-by-token', {
            token,
        })
        .then(xhr => {
            let { status, response } = xhr;
            if (status === 200) {
                api.defaults.headers.common['X-US-AUTH-TOKEN'] = `${response.token}`;
                localStorage.setItem(ACCESS_TOKEN, response.token);
                localStorage.setItem(USER, JSON.stringify(response.usuario));
                localStorage.setItem(PARAMS, JSON.stringify(response.parametros));
                if (response.menu?.length > 0) {
                    let menu = response.menu;
                    localStorage.setItem(MENU, JSON.stringify(menu));
                }
                return true;
            }
            return { status, response };
        });
}

export const sendEmail = (email) => api.post('auth/recovery-password', { email });

export const forceLogout = () => {
    delete api.defaults.headers.common['X-US-AUTH-TOKEN'];
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(SESSION);
    localStorage.removeItem(PARAMS);
    localStorage.removeItem(CONFIG);
    if (['/auth/login'].indexOf(window.location.pathname) === -1) {//SI NO ESTA EN AUTH/LOGIN LO MANDO PARA AHI
        window.location.href = '/auth/login';
    }
}

export const isLogged = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    return !!token;
}

export const checkSession = async () => {
    /*try {
        const res = await api.get('auth/check')
        if (res.status >= 300) {
            throw Error(res?.response?.error);
        }
    }
    catch(err){
        forceLogout();
        throw Error(err?.response?.error);
    }*/

    return true;
}
    

export const loadParams = async () => {
    const { response } =  await api.post('auth/params');
    return response;
}

export const loadMenu = async () => {
    const { response } =  await api.post('auth/menu');
    return response;
}

export const hasPermission = (key) => {
    let menu = JSON.parse(localStorage.getItem(MENU));
    if (!menu) {
        return false;
    }
    if (!Array.isArray(menu) || menu?.length === 0) {
        return false;
    }
    if (key === 'home') {
        return true;
    }
    
    const response = menu.filter(func => func.key === key).length > 0;
    return response;
}

/**
 * Devuleve el usuario actual
 * @returns {User}
 */
export const user = () => JSON.parse(localStorage.getItem(USER));