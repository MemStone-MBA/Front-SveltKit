import { Server } from 'socket.io';
import { LogsError } from './log.js'
import { Status } from './MatchmakingStatus.js';
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

export function SocketServer(server) {

	const io = new Server(server.httpServer);
	const matchMakingSearch = [];
	const matchMakingFriend = [];
	const sockets = []

	io.on('connection', (socket) => {
		console.log("connect : ", socket.id)


		socket.on('login', (data) => {
			login(data.mail, data.password, (res) => {
				if (res.id != null) {
					socket.matchmaking = { 'duelArray': [] }
					sockets[res.id] = socket;
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

		socket.on('matchmakingFriend', (dataUsers) => {

			let userId = dataUsers?.userId
			let userFriendId = dataUsers?.userFriendId

			if (userId == null || typeof userId !== 'string') {
				console.error("Missing userId or wrong type : ", userId)
				return;
			}

			if (sockets[userId] == null || typeof sockets[userId] !== 'object') {
				console.error("Missing socket of userId or wrong type at Socket.matchmakingFriend")
				return;
			}

			if (userFriendId == null || typeof userFriendId !== 'string') {
				console.error("Missing userFriendId or wrong type : ", userFriendId)
				return;
			}

			if (sockets[userFriendId] == null || typeof sockets[userFriendId] !== 'object') {
				console.error("Missing socket of userFriendId or wrong type at Socket.matchmakingFriend")
				return;
			}


			if (sockets[userId].matchmaking.duelArray[userFriendId] == null) {

				sockets[userId].matchmaking.duelArray[userFriendId] = {
					'status': Status.IsWaiting
				}

				sockets[userId].emit("matchmakingFriend",({status :  Status.Waiting }))

			} else {

				switch (sockets[userId].matchmaking.duelArray[userFriendId].status) {
					case Status.IsWaited:
						console.log(sockets[userId].matchmaking.duelArray[userFriendId].status)
						break;
						case Status.IsWaiting:
							console.log(sockets[userId].matchmaking.duelArray[userFriendId].status)
							break;
					case Status.Cancelled:
						console.log(sockets[userId].matchmaking.duelArray[userFriendId].status)
						break;
					case Status.InMatch:
						console.log(sockets[userId].matchmaking.duelArray[userFriendId].status)
						break;
					default:
						console.error(`userFriendId status of socket : ${userId} is null or wrong Type`)
						break;
				}
			}


			if (sockets[userFriendId].matchmaking.duelArray[userId] == null) {

				sockets[userFriendId].matchmaking.duelArray[userId] = {
					'status': Status.IsWaited
				}

				sockets[userFriendId].emit("matchmakingFriend",({status :  Status.IsWaited }))

			} else {

				switch (sockets[userFriendId].matchmaking.duelArray[userId].status) {
					case Status.IsWaited:
						console.log(sockets[userFriendId].matchmaking.duelArray[userId].status)
						break;
						case Status.IsWaiting:
							console.log(sockets[userFriendId].matchmaking.duelArray[userId].status)
							break;
					case Status.Cancelled:
						console.log(sockets[userFriendId].matchmaking.duelArray[userId].status)
						break;
					case Status.InMatch:
						console.log(sockets[userFriendId].matchmaking.duelArray[userId].status)
						break;
					default:
						console.error(`userId status of socket : ${userFriendId} is null or wrong Type`)
						break;
				}
			}

		


			// if (sockets[userId].matchmaking.duelArray[userFriendId] == null && sockets[userId].matchmaking.duelArray[userId] == null) {

			// 	matchMakingSearch[userId] = {

			// 		'duelArray': [{
			// 			userFriendId: {
			// 				"waiting": false
			// 			}
			// 		}

			// 		]


			// 	}

			// 	console.log(matchMakingSearch[userId])
			// 	console.log(sockets[userFriendId])
			// 	if (sockets[userFriendId] !== undefined)
			// 		sockets[userFriendId].emit('matchmakingFriendWait', { userId: user })
			// }
		})

		socket.on('matchmakingLeave', (user) => {
			for (let i = 0; i < matchMakingSearch.length; i++) {
				if (matchMakingSearch[i].id == user?.id) {
					matchMakingSearch.splice(i, 1)
				}
			}
		})
	});
}