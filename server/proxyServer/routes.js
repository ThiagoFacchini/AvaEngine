/* eslint-disable */
routes = {
  config: {
    jsonFilesPath: 'server/proxyServer/json/',
    baseInterceptUrl: '/api',
    answerDelay: 3000,
    displayLog: true,
  },
  list: [
    {
      route: '/something',
      method: 'get',
      jsonFile: 'users.json',
      returnKey: 'users',
      answerDelay: 0
    },
    {
      route: '/cars',
      method: 'post',
      jsonFile: 'cars.json',
      returnKey: 'cars'
    }
  ]
}

module.exports = routes
