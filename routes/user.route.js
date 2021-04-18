const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const validateMdw = require('../middlewares/validate.mdw');
const schemaUserSignup = require('../schemas/user.signup.json');

const router = express.Router();

router.post('/',validateMdw(schemaUserSignup),async(req, res)=>{
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    const ids = await userModel.add(user);
    user.id = ids[0];
    delete user.password;

    res.status(201).json(user);
})

module.exports = router;