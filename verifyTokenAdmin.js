const jwt = require('jsonwebtoken')
const createErrorResponseObject = require('./createErrorResponseObject')
const cookie = require('cookie')

async function verifyTokenAdmin(req, res, next) {
    var cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies['jwt'] || null
    if (token === null) {
      const response = createErrorResponseObject("horse")
      res.status(response.responsecode).json(response).end()
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          const response = createErrorResponseObject("horse")
          res.status(response.responsecode).json(response).end()
        } else {
          console.log(decoded);
          if (!decoded.is_admin) {
            throw new Error("aergia");
            return false
          } else {
            res.locals.username = decoded.username;
            res.locals.is_admin = decoded.is_admin;
            res.locals.can_add = decoded.can_add;
            res.locals.is_active_user = decoded.is_active_user;
            res.cookie('jwt', token, { httpOnly: true})
            next();
          }
        }
      })
    }
    }


module.exports = verifyTokenAdmin