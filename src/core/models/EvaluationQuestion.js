export default class EvaluationQuestion {

    /**
     * @type {number}
     */
    id = undefined;

    /**
     * @type {number}
     */
    evaluation_scheme_id = undefined;

    /**
     * @type {string}
     */
    title = undefined;

    /**
     * @type {string}
     */
    description = undefined;

    /**
     * @type {string}
     */
    question_type = undefined; // numeric | multiple_choice | text

    /**
     * @type {number}
     */
    max_score = undefined;

    /**
     * @type {number}
     */
    weight = undefined;

    /**
     * @type {number}
     */
    position = undefined;

    constructor(item = {}) {
        for (let key in item) {
            this[key] = item[key];
        }
    }

    hasWeight() {
        return this.weight !== null && this.weight !== undefined;
    }
}
