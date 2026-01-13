import { clearObj, open } from '../common/functions';
import Evaluation from '../models/Evaluation';
import EvaluationScheme from '../models/EvaluationScheme';
import EvaluationQuestion from '../models/EvaluationQuestion';
import StudentEvaluation from '../models/StudentEvaluation';
import api from './Api';

const path = 'evaluations';

/**
 * Listado de evaluaciones
 */
export const evaluationIndex = async (filter, output = undefined) => {
    let params = filter || {};
    params.page = filter?.page || 1;
    params.pageSize = filter?.pageSize || 50;

    if (output) {
        let exportFilter = { ...filter, output };
        clearObj(exportFilter);
        open(path, exportFilter);
        return;
    }

    const { response } = await api.get(path, { params });

    return {
        data: response.data.map(entity => new Evaluation(entity)),
        total: response.total,
    };
};

/**
 * Combo simple (sin paginación)
 */
export const evaluationCombo = async (filter) => {
    let params = filter || {};
    const { response } = await api.get(path, { params });

    return response.data.map(entity => new Evaluation(entity));
};

/**
 * Detalle de evaluación
 */
export const evaluationShow = async (id) => {
    const { response } = await api.get(`${path}/${id}`);

    const evaluation = new Evaluation(response);

    if (response.scheme) {
        evaluation.scheme = new EvaluationScheme(response.scheme);
        evaluation.scheme.questions =
            response.scheme.questions.map(q => new EvaluationQuestion(q));
    }

    if (response.student_evaluations) {
        evaluation.studentEvaluations =
            response.student_evaluations.map(se => new StudentEvaluation(se));
    }

    return evaluation;
};

/**
 * Crear evaluación completa (con esquema y preguntas)
 */
export const evaluationCreate = async (item) => {
    return await api.post(path, item);
};

/**
 * Actualizar evaluación (solo draft)
 */
export const evaluationUpdate = async (id, item) => {
    return await api.put(`${path}/${id}`, item);
};

/**
 * Enviar correcciones de evaluación
 */
export const submitCorrections = async (evaluationId, payload) => {
    return await api.post(`${path}/${evaluationId}/corrections`, payload);
};

/**
 * Listado de mis evaluaciones
 */
export const myEvaluationsIndex = async () => {
    const { response } = await api.get('/my-evaluations');
    return response.data.map(entity => new Evaluation(entity));
};

/**
 * Publicar evaluación
 */
export const evaluationPublish = async (ids) => {
    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    return Promise.all(
        ids.map(async (id) => await api.post(`${path}/${id}/publish`))
    );
};

/**
 * Eliminar evaluación
 */
export const evaluationDelete = async (ids) => {
    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    return Promise.all(
        ids.map(async (id) => await api.delete(`${path}/${id}`))
    );
};
