export default class EvaluationScheme {

    /**
     * @type {number}
     */
    id = undefined;

    /**
     * @type {number}
     */
    evaluation_id = undefined;

    /**
     * @type {string}
     */
    name = undefined;

    /**
     * @type {number}
     */
    total_score = undefined;

    /**
     * @type {EvaluationQuestion[]}
     */
    questions = [];

    constructor(item = {}) {
        for (let key in item) {
            this[key] = item[key];
        }
    }

    getTotalQuestions() {
        return this.questions.length;
    }
}
