var axios = require('axios')

module.exports = DelegatedAuthentication

function DelegatedAuthentication(config, stuff) {
  var self = Object.create(DelegatedAuthentication.prototype)

  // config for this module
  self._config = config

  var url = self._config.url
  if (!url) throw new Error('should specify "url" in config')

  return self
}

DelegatedAuthentication.prototype.authenticate = function (user, password, cb) {
  let params = {}
  params[this._config.user_key || 'username'] = user
  params[this._config.pwd_key || 'password'] = password
  axios.post(this._config.url, params)
  .then(function (res) {
    if(res.data.error) { // json-rpc error
      return cb(null, false)
    } else { // success: RESTful or json-rpc
      return cb(null, [user])
    }
  })
  .catch(function (error) {
    return cb(null, false)
  });
}
