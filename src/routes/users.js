const express = require('express')
const router = express.Router()
const ControllerUsers = require('../controller/users')
const { protect } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const { validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangeEmail,
    validateChangePassword } = require('../middlewares/common')

router
    .post('/register', validateRegister, ControllerUsers.registerAccount)
    .post('/login', validateLogin, ControllerUsers.loginAccount)
    .post('/refresh-token', ControllerUsers.refreshToken)
    .get('/profile', protect, ControllerUsers.profileAccount)
    .put('/profile', protect, upload.single('picture'), validateUpdateProfile, ControllerUsers.profileAccount)
    .put('/profile/changeEmail', protect, validateChangeEmail, ControllerUsers.changeEmail)
    .put('/profile/changePassword', protect, validateChangePassword, ControllerUsers.changePassword)
    .delete('/profile', protect, ControllerUsers.profileAccount)


module.exports = router