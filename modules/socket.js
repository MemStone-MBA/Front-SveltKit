import { Server } from 'socket.io';
import { LogsError } from './log.js'
import { Status } from './Matchmaking/Status.js';
import {
	insertNewCardInventory,
	getCardById,
	getAllCards,
	getCardsByUser,
	getDeckByUser,
	login,
	register,
	saveDeckByUser,
	getFriendsByUser,
} from './database.js';
import { MF_Fight,MF_Cancel } from './Matchmaking/MatchmakingFriend.js';
export let sockets = []

export function SocketServer(server) {

	const io = new Server(server.httpServer);
	const matchMakingSearch = [];
	const matchMakingFriend = [];

	io.on('connection', (socket) => {
		


		socket.on('login', (data) => {
			login(data.mail, data.password, (res) => {
				if (res.id != null) {
					socket.matchmaking = { 'duelArray': [] }
					socket.friends = []
					socket.userId = res.id;
					socket.username = res.username
					sockets[res.id] = socket;
					console.log("connected : ", socket.username)
				}
				socket.emit("login-res", res)
			})
		})

		socket.on('register', (data) => {
			register(data.username, data.mail, data.password, (res) => {
				socket.emit("register-res", res)
			})
		})

		socket.on('friends-user', (data, cb) => {
			getFriendsByUser(data.jwt, data.userId).then((res) => {
				cb(res)
			})
		})

		socket.on('cards', (data, cb) => {
			getAllCards(data.jwt).then((res) => {
				cb(res)
			})
		})

		socket.on('getCardById', (data, cb) => {
			getCardById(data.jwt, data.cardId).then((res) => {
				cb(res)
			})
		})

		socket.on('cards-user', (data, cb) => {
			getCardsByUser(data.jwt, data.userId).then((res) => {
				cb(res)
			})
		})

		socket.on('deck-user', (data, cb) => {
			getDeckByUser(data.jwt, data.userId).then((res) => {
				cb(res)
			})
		})

		socket.on('deck-save', (data, cb) => {
			saveDeckByUser(data.jwt, data.deck).then((res) => {
				cb(res)
			})
		})

		socket.on('drawNewCard', (data) => {
			getCardsByUser(data.jwt, data.userId).then((res) => {
				var same = false
				for (let card of res) {
					if (card.idCard == data.cardId) {
						same = true
					}
				}

				if (!same) {
					insertNewCardInventory(data.jwt, data.userId, data.cardId, ((res) => {
						console.log("new card in inventory")
					}))
				}
			})
		})

		socket.on('matchmakingSearch', (user) => {

			if (matchMakingSearch.length > 0) {
				var selectedPlayer = matchMakingSearch[matchMakingSearch.length - 1]
				matchMakingSearch.splice(matchMakingSearch.length - 1, 1);

				if (selectedPlayer.id != user.id) {

					sockets[selectedPlayer.id].emit('matchmakingSearch', { actualUser: selectedPlayer, selectedUser: user })
					sockets[user.id].emit('matchmakingSearch', { actualUser: user, selectedUser: selectedPlayer })

					for (let i = 0; i < matchMakingSearch.length; i++) {
						if (matchMakingSearch[i].id == selectedPlayer.id) {
							matchMakingSearch.splice(i, 1)
						}
					}
				}
			} else {
				matchMakingSearch.push(user)
			}
		})

		socket.on('friend-connexion', (dataUsers, callback) => {


			let userId = dataUsers?.userId
			let userFriendId = dataUsers?.userFriendId

			if (userId == null || typeof userId !== 'string') {
				console.error("Missing userId or wrong type : ", userId)
				return;
			}


			if (userFriendId == null || typeof userFriendId !== 'string') {
				console.error("Missing userFriendId or wrong type : ", userFriendId)
				return;
			}

			if (typeof callback !== 'function') {
				console.error("Missing user-connected callback")
				return;
			}


			if (sockets[userFriendId] != null) {

				sockets[userId].friends[userFriendId] = {
					status: Status.Connected
				}

				callback({ status: Status.Connected })
				sockets[userFriendId].emit('friend-connexion-status', ({ userFriendId: userId, status:  Status.Connected }))
			} else {

				sockets[userId].friends[userFriendId] = {
					status: Status.Disconnected
				}


				callback({ status:  Status.Disconnected })
            }




		})

		socket.on('disconnect', function () {
			console.log("disconnect : ", socket.username)
			for (let id in socket?.friends) {
				if (id != null)
					sockets[id].emit('friend-connexion-status', ({ userFriendId: socket.userId, status: Status.Disconnected }))
            }

		});

		

		MF_Fight(socket)
		MF_Cancel(socket)
		
		socket.on('matchmakingLeave', (user) => {
			for (let i = 0; i < matchMakingSearch.length; i++) {
				if (matchMakingSearch[i].id == user?.id) {
					matchMakingSearch.splice(i, 1)
				}
			}
		})
	});



}