import { Server } from 'socket.io';
import { LogsError } from './log.js'
import {ConnexionStatus} from './Friend/Status.js';
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
	buyCoins,
} from './database.js';
import { MF_Fight, MF_Cancel, MF_Initialize} from './Friend/MatchmakingFriend.js';
import { CF_Connected, CF_Disconnected, CF_Initialize } from './Friend/ConnexionFriend.js';
import { getUserCases } from './Cases/Users-Cases.js';
export let sockets = []

export function SocketServer(server) {

	const io = new Server(server.httpServer);
	const matchMakingSearch = [];
	io.on('connection', (socket) => {
		socket.on('login', (data) => {
			login(data.mail, data.password, (res) => {

				res.status = res.status ? res.status : res.response.status;
				switch (res.status){
					case 400:
						socket.emit("login-res",({'status': ConnexionStatus.ErrorIds}))
						break;
					case 200:


						if(sockets[res.data.id] != undefined){
							console.log("already connected")
							sockets[res.data.id].emit("login-err",({'status':ConnexionStatus.Replace}))

						}

						socket = MF_Initialize(socket)
						socket = CF_Initialize(socket,res.data)

						console.log("connected : ", socket.username)

						sockets[res.data.id] = socket;
						socket.emit("login-res",({'status':ConnexionStatus.Connected,'response': res.data}) )
						break;
					default:
						socket.emit("login-res",({'status':ConnexionStatus.Error}))
						break;
				}

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

		CF_Connected(socket)
		CF_Disconnected(socket)

		MF_Fight(socket)
		MF_Cancel(socket)

		socket.on('matchmakingLeave', (user) => {
			for (let i = 0; i < matchMakingSearch.length; i++) {
				if (matchMakingSearch[i].id == user?.id) {
					matchMakingSearch.splice(i, 1)
				}
			}
		})

		socket.on('buyCoins', (data, cb) => {
			buyCoins(data.user, data.amount).then((res) => {
				cb(res)
			})
		})

		socket.on('getUserCases', (data, cb) => {
			 getUserCases(data).then((res) => {

			 		cb(res)
			 })
		})

		socket.on("updateUserPlayground", (data) => {
			sockets[data.id][data.modifyId].playGround = data.playGround
			let game = sockets[data.id]

			for(let id of game.listIds) {
				sockets[id].emit('updateUserPlayground', game)
			}
		})

		socket.on('changeCardLife', (data) => {
			let pg = sockets[data.game.id][data.idUser].playGround

			var cardPG = Object.entries(pg).filter((col) => { return col[1].card && col[1].card.id == data.card.id })
			cardPG[0][1].card.life = data.newLife

			let game = sockets[data.game.id]

			for(let id of game.listIds) {
				sockets[id].emit('updateLife', {game: game, idUser: data.idUser, card: cardPG[0][1].card})
			}
		})

		var TODAY_CARD = {}

		socket.on('todayCard', (data, cb) =>{
			let dateNow = Date.now()

			if(TODAY_CARD.ts == undefined || isOld(dateNow, TODAY_CARD)) {

				getAllCards(data.jwt).then((res) => {
					var CARDS_ID = []
					var CARDS = []

					for(var i = 0; i < 3; i++){
						var random = Math.floor(Math.random() * res.length)
						if(CARDS_ID.includes(res[random]._id)){
							i--
							continue
						}
						CARDS_ID.push(res[random]._id)
					}

					var promises = []

					for(let id of CARDS_ID){
						promises.push(
							getCardById(data.jwt, id).then((res) => {
								if(res.status) {
									return
								}
								CARDS.push(res)
								CARDS = CARDS
							})
						)
					}

					Promise.all(promises).then(() => {
						TODAY_CARD = {
							ts: dateNow + 86400000,
							cards: CARDS
						}
						cb(TODAY_CARD)
					})
				})
			} else {
				cb(TODAY_CARD) 
			}
		})
		
		function isOld(now, array) {
			let ts = array.ts
			if(now - ts > 86400000) {
				return true
			}
			return false
		}
	});
}