const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const randomstring = require('randomstring');
const validateMdw = require('../middlewares/validate.mdw');
const schemaUserSignIn = require('../schemas/user.signin.json');
const schemaRef = require('../schemas/user.refresh.json'); 
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/',validateMdw(schemaUserSignIn), async (req, res) => {
    const user = await userModel.singleByUserName(req.body.username);
    console.log(user);
    if (user === null) {
        return res.json({
            authenticated: false
        })
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.json({
            authenicated: true
        })
    }

    const payload = {
        userId: user.id
    }
    const opts = {
        expiresIn: process.env.ACCESS_TOKEN_TIME_RELEASE * 60 // seconds, thời gian hết hạn access token
    }

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, opts);
    const refreshToken = randomstring.generate(+process.env.REFRESH_TOKEN_LENGTH);
    // Lúc xác thực user đúng thì server cấp một accessToken và một RefreshToken mới.

    await userModel.patchRFToken(user.id, refreshToken); // Lưu lại RefreshToken vào DB

    return res.json({
        authenicated: true,
        accessToken,
        refreshToken,
    })

})

router.post('/refresh',validateMdw(schemaRef),async(req, res)=>{  // endpoint xin server cấp lại accessToken
    const {accessToken, refreshToken} = req.body;
    const {userId} = jwt.verify(accessToken, process.env.SECRET_KEY,{
        ignoreExpiration: true // options Bypass nếu accessToken đã hết hạn.
    });

    const checkUserRef = await userModel.isValidRFToken(userId,refreshToken);
    if(checkUserRef === true){
        const opts = {
            expiresIn: process.env.ACCESS_TOKEN_TIME_RELEASE * 60 
        }
        const newAccessToken = jwt.sign({userId}, process.env.SECRET_KEY, opts);
        return res.status(200).json({
            accessToken: newAccessToken
        })
    }

    return res.status(400).json({
        message: 'Refresh Token is revoked or not found!'
    })
})

module.exports = router;


