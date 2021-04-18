const express = require('express');
const actorModel = require('../models/actor.model');
const validateMdw = require('../middlewares/validate.mdw');
const schemaActor = require('../schemas/actor.json');
const authMdw = require('../middlewares/auth.mdw');

const PQueue = require('p-queue');
const queue = new PQueue({concurrency: 1});

const router = express.Router();

router.use('/',authMdw); //Xác thực Token 

router.get('/', async (req, res) => {
    queue.add(async()=>{
    var listActor = await actorModel.allActors();
    
    }).then(res.status(200).json(listActor))
})


router.get('/:id', async (req, res) => {
    const actor = await actorModel.singeActor(req.params.id);
    res.status(200).json(actor);
})

router.post('/', validateMdw(schemaActor), async (req, res) => {
    const actor = req.body;
    const idActorAdded = await actorModel.addActor(actor);
    return res.status(201).json(idActorAdded); // return new id actor added
})

router.delete('/:id', async (req, res) => {
    const delResult = await actorModel.deleteActor(req.params.id);
    return res.status(202).json(delResult); // return 0 or 1 (fail or deleted)
})

router.put('/:id', validateMdw(schemaActor), async (req, res) => {
    const actor = req.body;
    const actorUpda = await actorModel.updateActor(req.params.id, actor);
    return res.status(200).json(actorUpda);
})

module.exports = router;