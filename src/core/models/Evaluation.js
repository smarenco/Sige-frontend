export default class Evaluation {

    /**
     * @type {number}
     */
    id = undefined;

    /**
     * @type {number}
     */
    course_id = undefined;

    /**
     * @type {number}
     */
    group_id = undefined;

    /**
     * @type {number}
     */
    teacher_id = undefined;

    /**
     * @type {string}
     */
    name = undefined;

    /**
     * @type {string}
     */
    type = undefined;

    /**
     * @type {number}
     */
    max_score = undefined;

    /**
     * @type {number}
     */
    weight = undefined;

    /**
     * @type {string}
     */
    date = undefined;

    /**
     * @type {string}
     */
    status = 'draft';

    /**
     * @type {EvaluationScheme|null}
     */
    scheme = null;

    constructor(item = {}) {
        for (let key in item) {
            this[key] = item[key];
        }
    }

    getId() {
        return this.id;
    }

    isDraft() {
        return this.status === 'draft';
    }

    isPublished() {
        return this.status === 'published';
    }
}
