const jwt = require('jsonwebtoken')
const generateToken = (payload) => {
    const verifyOpts = {
        expiresIn: '2h',
        issuer: 'shopers'
    }
    const token = jwt.sign(payload, process.env.SECRETE_KEY_JWT, verifyOpts)
    return token;
}

const generateRefreshToken = (payload) => {
    const verifyOpts = { expiresIn: '7d' }
    const token = jwt.sign(payload, process.env.SECRETE_KEY_JWT, verifyOpts)
    return token;
}

module.exports = {
    generateToken,
    generateRefreshToken
}