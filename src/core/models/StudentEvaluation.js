export default class StudentEvaluation {

    /**
     * @type {number}
     */
    id = undefined;

    /**
     * @type {number}
     */
    evaluation_id = undefined;

    /**
     * @type {number}
     */
    student_id = undefined;

    /**
     * @type {number}
     */
    final_score = undefined;

    /**
     * @type {string}
     */
    status = 'pending';

    /**
     * @type {string}
     */
    graded_at = undefined;

    /**
     * @type {User|null}
     */
    student = null;

    /**
     * @type {StudentQuestionScore[]}
     */
    question_scores = [];

    constructor(item = {}) {
        for (let key in item) {
            this[key] = item[key];
        }
    }

    isGraded() {
        return this.status === 'graded';
    }
}
