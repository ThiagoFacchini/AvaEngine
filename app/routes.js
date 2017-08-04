// @flow
import { getAsyncInjectors } from './utils/asyncinjectors'

const errorLoading = (err) => {
	console.error('Dynamic page loading failed', err)
}

const loadModule = (cb) => (componentModule) => {
	cb(null, componentModule.default)
}

const pathsLoaded = {}
let currentPath = ''

function onEnterHook (nextState: Object, replace: Function) {
	const routeDefs = nextState.routes[1]
	currentPath = routeDefs.path
}

export default function createRoutes (store: Object) {
  // Create reusable async injectors using getAsyncInjectors factory
	const { injectReducer, injectSagas } = getAsyncInjectors(store) // eslint-disable-line no-unused-vars

	return [
		{
			path: '/',
			name: 'homePage',
			config: {},
			onEnter: onEnterHook,
			getComponent (nextState: Object, cb: Function) {
				const importModules = Promise.all([
					import('./views/HomePage/reducer'),
					import('./views/HomePage/sagas'),
					import('./views/HomePage'),
				])

				const renderRoute = loadModule(cb)

				importModules.then(([reducer, sagas, component]) => {
					if (pathsLoaded.homePage !== true) {
						injectReducer('homePage', reducer.default)
						injectSagas(sagas.default)
					}

					if (currentPath === '/') {
						renderRoute(component)
						pathsLoaded.homePage = true
					}
				})

				importModules.catch(errorLoading)
			},
		},	{
			path: '*',
			name: 'notfound',
			config: {},
			onEnter: onEnterHook,
			getComponent (nextState: Object, cb: Function) {
				const importModules = Promise.all([
					// $FlowFixMe
					import('views/NotFoundPage'),
				])

				const renderRoute = loadModule(cb)

				importModules.then(([component]) => {
					renderRoute(component)
				})

				importModules.catch(errorLoading)
			},
		},
	]
}
