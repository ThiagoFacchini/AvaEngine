/* eslint-disable */

// Dependencies
const path              = require('path')
const chalk 			      = require('chalk')
const router            = require('express').Router()
const jsonfileReader    = require('jsonfile')
const rootpath          = require('get-root-path')
const proxy 			      = require('http-proxy-middleware')
const waterfall         = require('async-waterfall')
const fileExists        = require('file-exists')
const logger            = require('../logger')

// Variable declaration
const chalkTitle          = chalk.white
const chalkLabel          = chalk.green
const chalkValue          = chalk.magenta
const chalkDivider        = chalk.gray('-----------------------------------')

// Configurations
const routeConfigs        = require('../proxyServer/routes')
require('../../app/config/serverConfig.dev')

let routeListIndex
let configs           = {}
let serverUrl
let routeList

const defaultConfigs = {
  jsonFilesPath:    'server/proxyServer/json/',
  baseUrl:          '/api',
  answerDelay:      2000,
  displayLog:       true
}

function init( callback ) {
  waterfall([
    // 1 - Validate if the routes.js file contain the config node
    ( callback ) => {
      logger.info(' Searching for Proxy configuration...')
      if ( routeConfigs.config ) {
        configs = Object.assign( defaultConfigs, routeConfigs.config )
        logger.success('Proxy configuration loaded.\n')
        return callback( null )
      } else {
        logger.warning('Proxy configuration not found, using default...')
        configs = defaultConfigs
        return callback( null )
      }
    },

    // 2 - Checking if the routes.js file contain the list node
    ( callback ) => {
      logger.info(' Searching for Route list...')
      if ( routeConfigs.list ) {
        logger.success('Route list loaded.\n')
        routeList = routeConfigs.list
        return callback( null )
      } else {
        logger.error('Not found. Aborting...\n')
        return callback( true )
      }
    },

    // 3 - Validatinfg if /app/config/serverConfig.dev.js was properly loaded
    ( callback ) => {
      logger.info(' Checking serverConfig settings...')
      if ( typeof serverConfig !== 'undefined') {
        logger.success('Object found.\n')
        return callback( null )
      } else {
        logger.error('serverConfig settings not found. Aborting...')
        return callback( true )
      }
    },

    // 4 - Validating if serverConfig.dev.js contains the object serverConfig.serverUrl
    ( callback ) => {
      logger.info(' Checking serverConfig.serverUrl property...')
      if ( serverConfig.serverUrl ) {
        serverUrl = serverConfig.serverUrl
        logger.success('Found.\n')
        return callback( null )
      } else {
        logger.error('serverConfig.dev.js do not have serverUrl property. Aborting...')
        return callback( true )
      }
    },

    // 5 - Generating the Express Router Object
    ( callback ) => {
      routeListIndex = 0
      generateRouter( ( err, res ) => {
        if ( err ) {
          logger.error(' ' + err)
          callback( err )
        } else {
          logger.success('Routing done.\n')
          callback( null, res )
        }
      })
    },
  ], ( err, res ) => {
    if ( err ) {
      log.error( err );
    } else {
      callback( res )
    }
  })
}

// Helper Functions
// Iterate through routeList file
function generateRouter( callback ) {

  // Check if the currentIndex is smaller than the total
  // amount of routes in the route config file
  if ( routeListIndex < routeList.length ) {
    // Call the function which loads the route into express Router
    // and pass itself as callback, so it can keep looping till the end
    // of the routes.list in a sync way
    loadRoutesContent( function() {
      routeListIndex++
      generateRouter( callback )
    })

  } else {
    // Reached the end of routes, time to append the http-proxy-middleware
    // into express Router Object and return it
    router.use(
      configs.baseUrl,
      proxy({
        target: serverUrl,
        changeOrigin: true,
        logLevel: 'silent',
        onProxyReq: ( proxyReq, req, res) => {
          const msg = {
            route:          proxyReq.path,
            serverAddress:  serverUrl,
            method:         proxyReq.method
          }
          logger.routeBypassed( msg )
          requestUrl = serverUrl + proxyReq.path
          proxyReq.path = requestUrl
        }
      })
    )
    callback( null, router )
  }
}

// Load the routes
function loadRoutesContent( callback ) {
  logger.info(' Generating route ' + (routeListIndex+1) + ' out of ' + routeList.length)

  waterfall([
    // Validating routeCandidate
    ( callback ) => {
      logger.infoSub(' Validating route configuration...')
      validateRoute( routeList[routeListIndex], ( err, routeObj) => {
        if ( err ) {
          logger.errorSub('Could not load route ' + (routeListIndex+1) + '. Reason: ' + err )
          callback( true )
        } else {
          logger.successSub('Passed.')
          callback( null, routeObj )
        }
      })
    },

    // Loading json content
    ( routeObj, callback ) => {
      logger.infoSub(' Parsing route JSON file...')
      getJsonFileContent( routeObj.jsonFile, ( err, jsonContent ) => {
        if ( err ) {
          logger.errorSub('Error trying to read route jsonFile '+ routeObj.jsonFile + '. Description ' + err )
        } else {
          logger.successSub('Parsed')
          callback( null, routeObj, jsonContent )
        }
      })
    },

    // Building the route
    ( routeObj, jsonContent, callback ) => {
      let answerDelay = 0
      const displayObject = {
        route: routeObj.route,
        method: routeObj.method,
        serverAddress: serverUrl
      }

      // Figuring out answer delay
      if ( routeObj.answerDelay !== null  && routeObj.answerDelay !== undefined ) {
        answerDelay = routeObj.answerDelay

      } else if ( configs.answerDelay ) {
        answerDelay = configs.answerDelay
      }

      if ( routeObj.method == 'get') {
        router.get( configs.baseUrl + routeObj.route, (req, res ) => {

          if ( configs.displayLog ) {
            logger.routeIntercepted( displayObject )
          }

          setTimeout( () => {
            return res.status(200).send(jsonContent[routeObj.returnKey])
          }, answerDelay )
        })

        callback( null )

      } else if ( routeObj.method == 'post') {
        router.post( configs.baseUrl + routeObj.route, (req, res ) => {

          if ( configs.displayLog ) {
            logger.routeIntercepted( displayObject )
          }

          setTimeout( () => {
            return res.status(200).send(jsonContent[routeObj.returnKey])
          }, answerDelay )
        })

        callback( null )
      }
    }
  ], ( err, res ) => {
    if ( err ) {
      logger.errorSub('Route Skipped.\n')
    } else {
      logger.successSub('Route generated.\n')
    }
    callback()
  })
}

// Open, parse a json file returning an object
function getJsonFileContent( filename, callback ) {
  const jsonFile = path.join( rootpath.rootPath, configs.jsonFilesPath + filename )

  waterfall([
    // Checking if the file exists
    ( callback ) => {
      fileExists( jsonFile, ( err, exists ) => {
        if ( err ) {
          return callback('Could not find the file ' + jsonFile )
        } else {
          return callback( null )
        }
      })
    },

    // Reading the json file
    ( callback ) => {
      jsonfileReader.readFile( jsonFile, ( err, jsonContent ) => {
        if ( err ) {
          return callback( err )
        } else {
          callback( null, jsonContent )
        }
      })
    }
  ], ( err, jsonContent ) => {
    if ( err ) {
      callback( err )
    } else {
      callback( null, jsonContent )
    }
  })
}

// Check if the route params were provided and are valid
function validateRoute( routeCandidate, callback ) {
  let routeObj        = {}
  const defaultRouteObj = {
    method:     'get',
  }

  waterfall([
    // Validating route address
    ( callback ) => {
      if ( routeCandidate.route ) {
        return callback(null)
      } else {
        return callback('No route provided')
      }
    },

    // Validating jsonFile
    ( callback ) => {
      if ( routeCandidate.jsonFile ) {
        return callback(null)
      } else {
        return callback('No jsonFile provided')
      }
    },

    // Validating returnKey
    ( callback ) => {
      if ( routeCandidate.returnKey ) {
        callback( null )
      } else {
        return callback('No returnKey provided')
      }
    },

    // Generating routeObj
    ( callback ) => {
      routeObj = Object.assign( defaultRouteObj, routeCandidate )
      callback( null, routeObj )
    }
  ],( err, res ) => {
    if ( err ) {
      callback( err )
    } else {
      callback( null, res )
    }
  })
}


module.exports = init
