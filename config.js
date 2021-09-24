let envs = {};
try { 
  envs = process.env
  // require('dotenv').config({path: '.env'});
  // if (!('error' in result)) {
  //   envs = result.parsed;
  // }
  // console.log(result)
} catch (error) {
  Object.keys(process.env).forEach(x => {
    envs[x] = process.env.x
  })
  console.log('%cconfig.js line:4 error', 'color: #007acc;', error);  
}

module.exports = envs;