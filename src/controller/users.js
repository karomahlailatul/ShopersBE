const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const usersModel = require('../models/users')
const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');
const createError = require('http-errors')

const UserController = {
  registerAccount: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const checkEmail = await usersModel.findEmail(email)

      try {
        if (checkEmail.rowCount == 1) throw 'Email is already used';
      } catch (error) {
        return (commonHelper.response(res, null, 403, error))
      }

      const saltRounds = 10;
      const passwordHash = bcrypt.hashSync(password, saltRounds);
      // const passwordHash = password;
      const id = uuidv4().toLocaleLowerCase();

      const PORT = process.env.PORT
      const DB_HOST = process.env.DB_HOST
      const picture = `http://${DB_HOST}:${PORT}/upload/default.png`

      const data = {
        id,
        name,
        email,
        passwordHash,
        picture,
        role
      }

      await usersModel.create(data)
        .then(
          result => commonHelper.response(res, result.rows, 201, "User Created")
        )
        .catch(err => res.send(err)
        )

    } catch (error) {
      res.send(createError(400));
    }
  },
  loginAccount: async (req, res) => {
    try {
      const { email, password } = req.body
      const { rows: [user] } = await usersModel.findEmail(email)
      if (!user) {
        return commonHelper.response(res, null, 403, 'User Not Registed')
      }
      const isValidPassword = bcrypt.compareSync(password, user.password)
      console.log(isValidPassword);

      if (!isValidPassword) {
        return commonHelper.response(res, null, 403, 'Password is invalid')
      }
      delete user.password
      const payload = {
        email: user.email,
        role: user.role
      }
      user.token = authHelper.generateToken(payload)
      user.refreshToken = authHelper.generateRefreshToken(payload)

      commonHelper.response(res, user, 201, 'Login is Successful')
    } catch (error) {
      res.send(createError(400));
    }
  },
  profileAccount: async (req, res) => {
    try {
      const queryUpdate = req.query.update;
      const queryDelete = req.query.delete;

      const email = req.payload.email
      const { rows: [user] } = await usersModel.findEmail(email)
      delete user.password

      if (
        typeof (queryUpdate) === 'undefined' &&
        typeof (queryDelete) === 'undefined'
      ) {
        commonHelper.response(res, user, 200)
      } else if (
        typeof (queryUpdate) === 'string' &&
        typeof (queryDelete) === 'undefined'
      ) {

        const PORT = process.env.PORT
        const DB_HOST = process.env.DB_HOST
        const filepicture = req.file.filename;
        const picture = `http://${DB_HOST}:${PORT}/upload/${filepicture}`

        const {
          username,
          name,
          gender,
          phone,
          date_of_birth,
          shipping_address,
          role
        } = req.body;


        const checkUsername = await usersModel.findUsername(username)
        try {
          if (checkUsername.rowCount == 1) throw 'Username is already used';
        } catch (error) {
          return (commonHelper.response(res, null, 403, error))
        }

        const genderLowerCase = gender.toLowerCase()

        await usersModel.updateAccount(
          email,
          username,
          name,
          genderLowerCase,
          phone,
          date_of_birth,
          picture,
          shipping_address,
          role
        );

        commonHelper.response(res, null, 201, "Profile has been updated")
      } else if (
        typeof (queryUpdate) === 'undefined' &&
        typeof (queryDelete) === 'string'
      ) {
        await usersModel.deleteAccount(email)
        commonHelper.response(res, null, 200, "Account has been deleted")
      }
    } catch (error) {
      res.send(createError(404));
    }
  },

  changeEmail: async (req, res) => {
    try {
      const email = req.payload.email
      const emailBody = req.body.email
      console.log(email + emailBody)
      await usersModel.changeEmailAccount(email, emailBody)
      commonHelper.response(res, null, 201, "Email Account has been update, Please Login again")
    } catch (error) {
      res.send(createError(404));
    }
  },

  changePassword: async (req, res) => {
    try {
      const email = req.payload.email
      const { password } = req.body
      const saltRounds = 10;
      const passwordNewHash = bcrypt.hashSync(password, saltRounds);
      console.log(email + ' ' + password + '   ' + passwordNewHash)
      await usersModel.changePassword(email, passwordNewHash)
      commonHelper.response(res, null, 200, "Password Account has been update")
    } catch (error) {
      res.send(createError(404));
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT)
    const payload = {
      email: decoded.email,
      role: decoded.role
    }
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload)
    }
    commonHelper.response(res, result, 200, 'Refresh Token Success')
  },
}


module.exports = UserController 