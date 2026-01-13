export default class StudentQuestionScore {

    /**
     * @type {number}
     */
    id = undefined;

    /**
     * @type {number}
     */
    student_evaluation_id = undefined;

    /**
     * @type {number}
     */
    evaluation_question_id = undefined;

    /**
     * @type {number}
     */
    score = undefined;

    /**
     * @type {string}
     */
    comment = undefined;

    constructor(item = {}) {
        for (let key in item) {
            this[key] = item[key];
        }
    }

    hasScore() {
        return this.score !== null && this.score !== undefined;
    }
}
