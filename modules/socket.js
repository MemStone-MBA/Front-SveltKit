import { Server } from 'socket.io';
import { get, login, register } from './database.js'

export function SocketServer (server) {


	const io = new Server(server.httpServer);

	io.on('connection', (socket) => {
		console.log("connect")
		// Generate a random username and send it to the client to display it
		let username = `User ${Math.round(Math.random() * 999999)}`;
		socket.emit('name', username);

		// Receive incoming messages and broadcast them
		socket.on('message', (message) => {
			io.emit('message', {
				from: username,
				message: message,
				time: new Date().toLocaleString()
			});
		});

		socket.on('login',(data)=>{
			login(data.mail, data.password, (res) => {
				io.emit("login-res", res)
			})
		})

		socket.on('register',(data)=>{
			register(data.username, data.mail, data.password, (res) => {
				io.emit("register-res", res)
			})
		})

	});
}


