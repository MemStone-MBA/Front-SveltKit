import { Server } from 'socket.io';
import {  getAllCards, getCardsByUser, getDeckByUser, login, register, saveDeckByUser } from './database.js';

export function SocketServer (server) {


	const io = new Server(server.httpServer);

	io.on('connection', (socket) => {
		console.log("connect")
		// Generate a random username and send it to the client to display it
		let username = `User ${Math.round(Math.random() * 999999)}`;
		socket.emit('name', username);

		// Receive incoming messages and broadcast them
		socket.on('message', (message) => {
			socket.emit('message', {
				from: username,
				message: message,
				time: new Date().toLocaleString()
			});
		});

		socket.on('login',(data)=>{
			login(data.mail, data.password, (res) => {
				socket.emit("login-res", res)
			})
		})

		socket.on('register',(data)=>{
			register(data.username, data.mail, data.password, (res) => {
				socket.emit("register-res", res)
			})
		})

		socket.on('cards',(data)=>{
			getAllCards(data.jwt).then((res)=>{
				socket.emit('cards',res)
			})
		})


		socket.on('cards-user',(data)=>{
			getCardsByUser(data.jwt,data.userId).then((res)=>{
				socket.emit('cards-user',res)
			})
		})

		socket.on('deck-user', (data) => {
			getDeckByUser(data.jwt,data.userId).then((res)=>{
				socket.emit('deck-user',res)
			})
		})

		socket.on('deck-save', (data) => {
			saveDeckByUser(data.jwt,data.deck).then((res)=>{
				//console.log(res)
				socket.emit('deck-save',res)
			})
		})



	});
}


