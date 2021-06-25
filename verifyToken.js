const jwt = require('jsonwebtoken')
const createErrorResponseObject = require('./createErrorResponseObject')
const cookie = require('cookie')

async function verifyToken(req, res, next) {
  try{
    var cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies['jwt'] || null
    token === null && res.status(403).send('')
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(403).send('')
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
  } catch(err) {
    if (err.message === 403){
    res.status(403)
    res.send("Please log in to continue.")
    }
    else {
      const response = createErrorResponseObject(err.message || err)
      res.status(response.responsecode).json(response)
    }
  }
}

module.exports = verifyToken