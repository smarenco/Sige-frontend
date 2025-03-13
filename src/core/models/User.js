export default class User {

    /**
     * @type {number}
     */
    id = undefined;

    /**
     * @type {number}
     */
    account_id = undefined;

    /**
     * @type {string}
     */
    document = undefined;

    /**
     * @type {string}
     */
    last_name = undefined;

    /**
     * @type {date}
     */
    birth_day = undefined;

    /**
     * @type {string}
     */
    gender = undefined;

    /**
     * @type {string}
     */
    direction = undefined;

    /**
     * @type {string}
     */
    email = undefined;

    /**
     * @type {string}
     */
    password = undefined;

    /**
     * @type {number}
     */
    country_id = undefined;

    /**
     * @type {number}
     */
    city_id = undefined;

    /**
     * @type {string}
     */
    location = undefined;

    /**
     * @type {number}
     */
    medical_coverage_id = undefined;

    /**
     * @type {string}
     */
    type = undefined;

    /**
     * @type {string}
     */
    description = undefined;

    /**
     * @type {array}
     */
    documents = [];

    /**
     * @type {string}
     */
    document_category_id = undefined;

    /**
     * @type {boolean}
     */
    work_in_similar_area = false;

    /**
     * @type {boolean}
     */
    has_knowledge_in_area = false;

    /**
     * @type {boolean}
     */
    trained = false;

    /**
     * @type {string}
     */
    expectation = undefined;

    /**
     * @type {string}
     */
    level_education = undefined;

    /**
     * @type {string}
     */
    observation = undefined;

    /**
     * @type {boolean}
     */
    deleted = false;

    constructor(item) {
        for (let key in item) {
            this[key] = item[key];
        }
    }

    /**
     * Devuelve el ID del modelo
     * @return {int}
     */
    getId() {
        return this.id;
    }

    /**
     * @return {boolean}
     */
    isActive = () => !this.Baja;
}