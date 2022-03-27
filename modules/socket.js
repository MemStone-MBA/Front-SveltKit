import { Server } from 'socket.io';

import {  insertNewCardInventory, getCardById, getAllCards, getCardsByUser, getDeckByUser, login, register, saveDeckByUser } from './database.js';

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

		socket.on('cards',(data, cb)=>{
			getAllCards(data.jwt).then((res)=>{
				cb(res)
			})
		})

		socket.on('getCardById',(data, cb) =>{
			getCardById(data.jwt, data.cardId).then((res)=>{
				cb(res)
			})
		})

		socket.on('cards-user',(data, cb)=>{
			getCardsByUser(data.jwt,data.userId).then((res)=>{
				console.log(res)
				cb(res)
			})
		})

		socket.on('deck-user', (data, cb) => {
			getDeckByUser(data.jwt,data.userId).then((res)=>{
				cb(res)
			})
		})

		socket.on('deck-save', (data, cb) => {
			saveDeckByUser(data.jwt,data.deck).then((res)=>{
				cb(res)
			})
		})

		socket.on('drawNewCard', (data) => {
			getCardsByUser(data.jwt,data.userId).then((res)=>{
				var same = false
				for(let card of res) {
					if(card.idCard == data.cardId) {
						same = true
					}
				}

				if(!same) {
					insertNewCardInventory(data.jwt, data.userId, data.cardId, ((res) => {
						console.log("new card in inventory")
					}))
				}
			})
		})
	});
}


