export default class AbsenteeismCauses {

    /**
     * @type {number}
     */
    id = undefined;

    /**
     * @type {string}
     */
    name = undefined;

    /**
     * @type {boolean}
     */
    online = undefined;

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