import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import {SocketServer} from './modules/socket.js'
import { config } from 'dotenv';
import replace from '@rollup/plugin-replace';


/** @type {import('@sveltejs/kit').Config} */
const configs = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({ out: 'build' }),
		vite: {
			plugins: [
				{
					name: 'sveltekit-socket-io',
					configureServer(server) {

						SocketServer(server)
						//SocketIoPart

						console.log('SocketIO injected');
					}
				},
				replace({
					process: JSON.stringify({
						env: {
							...config().parsed,
						}
					}),
				}),
				
			]
		}
	}
};

export default configs;
