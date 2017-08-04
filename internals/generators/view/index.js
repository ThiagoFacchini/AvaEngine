// @noflow
/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists')

module.exports = {
	description: 'Add a view component',
	prompts: [{
		type: 'input',
		name: 'name',
		message: 'What should it be called?',
		default: 'Form',
		validate: (value) => {
			if ((/.+/).test(value)) {
				return componentExists(value) ? 'A view, container or component with this name already exists' : true
			}
			return 'The name is required'
		},
	}],
	actions: (data) => {
		const actions = [{
			type: 'add',
			path: '../../app/views/{{properCase name}}/index.js',
			templateFile: './view/index.js.hbs',
			abortOnFail: true,
		}, {
			type: 'add',
			path: '../../app/views/{{properCase name}}/tests/index.test.js',
			templateFile: './view/test.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/styles.css',
			templateFile: './view/styles.css.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/messages.js',
			templateFile: './view/messages.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/actions.js',
			templateFile: './view/actions.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/tests/actions.test.js',
			templateFile: './view/actions.test.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/constants.js',
			templateFile: './view/constants.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/selectors.js',
			templateFile: './view/selectors.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/tests/selectors.test.js',
			templateFile: './view/selectors.test.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/reducer.js',
			templateFile: './view/reducer.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/tests/reducer.test.js',
			templateFile: './view/reducer.test.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/sagas.js',
			templateFile: './view/sagas.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: '../../app/views/{{properCase name}}/tests/sagas.test.js',
			templateFile: './view/sagas.test.js.hbs',
			abortOnFail: true,
		}]
		return actions
	},
}
