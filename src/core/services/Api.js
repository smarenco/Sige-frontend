import axios from "axios";
import { API_URL } from "../../env";
import { ACCESS_TOKEN, CONFIG, PARAMS, SESSION, USER } from "../common/consts";

const instance = axios.create({
    baseURL: API_URL,
    validateStatus: status => status < 400,
});

const handleSuccess = response => {
    return {
        status: response.status,
        response: response.data,
    };
}

const handleError = error => {
    if (error && error.response && error.response.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(USER);
        localStorage.removeItem(SESSION);
        localStorage.removeItem(PARAMS);
        localStorage.removeItem(CONFIG);
        delete instance.defaults.headers.common['X-US-AUTH-TOKEN'];

    }
    if (error.message === 'Network Error') {
        return Promise.reject({ message: 'Se ha perdido la conexión con el servidor. Por favor, vuelva a intentarlo' });
    }
    if (error.response !== undefined) {
        return Promise.reject({
            status: error.response.status,
            response: error.response.data,
        });
    }
    return Promise.reject(error);
}

instance.interceptors.response.use(handleSuccess, handleError);

const access_token = localStorage.getItem(ACCESS_TOKEN);
instance.defaults.headers.common['X-US-AUTH-TOKEN'] = access_token;


export default instance;