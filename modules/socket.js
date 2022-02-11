import { Server } from 'socket.io';


export function SocketServer (server) {


	const io = new Server(server.httpServer);

	io.on('connection', (socket) => {
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



		io.on('register',(data)=>{


			io.emit("register-res",{})
			io.emit("register-err",{})
		})

		io.on('connect',(data)=>{



			io.emit("connect-res",{})
			io.emit("connect-err",{})
		})


	});

}


