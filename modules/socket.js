import { Server } from 'socket.io';
import { get } from './database.js'

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



		socket.on('register',(data)=>{


			io.emit("register-res",{})
			io.emit("register-err",{})
		})

		socket.on('login',(data)=>{

			console.log("login")

			get("cards").then((res) => {
				io.emit("connect-res", res)
			})
		})


	});

}


