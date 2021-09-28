const jwt = require('jsonwebtoken')
const createErrorResponseObject = require('./createErrorResponseObject')
const cookie = require('cookie')

async function verifyToken(req, res, next) {
    var cookies = cookie.parse(req.headers.cookie || '');
    console.log('%cverifyToken.js line:7 cookies', 'color: #007acc;', cookies);
    const token = cookies['jwt'] || null
    if (token === null) {
      const response = createErrorResponseObject("horse")
      res.status(response.responsecode).json(response).end()
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        console.log('%cverifyToken.js line:14 err', 'color: #007acc;', err);
        if (err) {
          const response = createErrorResponseObject("horse")
          res.status(response.responsecode).json(response).end()
        } else {
          console.log(decoded);
          if (!decoded.is_active_user) {
            throw new Error("aergia");
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


module.exports = verifyToken