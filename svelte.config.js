import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import {SocketServer} from './modules/socket.js'
/** @type {import('@sveltejs/kit').Config} */
const config = {
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
				}
			]
		}
	}
};

export default config;
