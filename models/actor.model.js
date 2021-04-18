const db = require('../utils/db');

module.exports = {
    async allActors() {
        return db('actor');
    },

    async singeActor(id) {
        const actor = await db('actor').where('actor_id', id);
        if (actor.length === 0) {
            return null;
        }
        return actor[0];
    },

    async addActor(actor) {
        return db('actor').insert(actor); // return new id actor added
    },

    async deleteActor(id) {
        return db('actor').where('actor_id', id).del();
    },

    async updateActor(id, actor) {
        return db('actor').where('actor_id', id).update(actor);
    }
}