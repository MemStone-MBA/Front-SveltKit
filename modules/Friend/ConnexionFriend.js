import { Status, MatchmakingStatus } from "./Status.js";
import { sockets } from "../socket.js";



export function CF_Initialize(socket,res) {
	socket.friends = []
	socket.userId = res.id;
	socket.username = res.username
	return socket
}

export function CF_Connected(socket) {
	socket.on('friend-connexion', (dataUsers, callback) => {


		let userId = dataUsers?.userId
		let userFriendId = dataUsers?.userFriendId

		checkUser(userId, _ => {

		
			if (typeof callback !== 'function') {
				console.error("Missing user-connected callback")
				return;
			}


			checkUser(userFriendId, _ => {

				if (sockets[userFriendId] != null) {
					sockets[userId].friends[userFriendId] = {
						status: Status.Connected
					}

					sockets[userFriendId].friends[userId] = {
						status: Status.Connected
					}

					callback({ status: Status.Connected })
					send_status(userFriendId, { userFriendId: userId, status: Status.Connected })

				} else {
					sockets[userId].friends[userFriendId] = {
						status: Status.Disconnected
					}
					callback({ status: Status.Disconnected })
                }

			})


        })

	})
}

export function CF_Disconnected(socket) {

	socket.on('disconnect', function () {
		console.log("disconnect : ", socket.username)
		for (let id in socket?.friends) {
			if (id != null) {
				

				checkUser(id, _ => {


					sockets[id].friends[socket.userId].status = Status.Disconnected
					send_status(id, { userFriendId: socket.userId, status: Status.Disconnected })

				})

				
				
            }
				
		}

	});
}



function checkUser(userId, callback){

	if (userId == null || typeof userId !== 'string') {
		console.error("Missing userId or wrong type : ", userId)
		return;
	}


    if(typeof callback === 'function'){
        callback();
    } 
}



function send_status(_id,data){
    //console.log(sockets[_id].matchmaking)
	sockets[_id].emit('friend-connexion-status',(data))
}
