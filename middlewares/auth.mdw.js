const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
        try {
            var decoded = jwt.verify(accessToken, process.env.SECRET_KEY); // decode access token với Secret_key để lấy ra thông tin object Payload
            req.accessTokenPayLoad = decoded;
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({
                message: 'Invalid access token!'
            })
        }
    } else {
        return res.status(400).json({
            message: 'Access Token not found!'
        })
    }
}