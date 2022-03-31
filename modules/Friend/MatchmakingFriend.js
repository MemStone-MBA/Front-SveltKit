import { Status, MatchmakingStatus } from "./Status.js";
import { sockets } from "../socket.js";


export function MF_Initialize(socket) {
    socket.matchmaking = { 'duelArray': [] }
    return socket
}



export function MF_Fight(socket){
	socket.on('matchmakingFriend-duel', (dataUsers) => {

        let userId = dataUsers?.userId
        let userFriendId = dataUsers?.userFriendId


        


        checkUser(userId, _ => {



            if (!Array.isArray(sockets[userId].friends) || typeof sockets[userId].friends[userFriendId] !== 'object') {
                console.error("Missing friend of user or wrong type at Socket.matchmakingFriend")
                return;
            }

            let friendStatus = sockets[userId].friends[userFriendId].status;
            if (friendStatus == Status.Disconnected) {
                send_duel(userId, { friendStatus })
                return;
            }

            checkUser(userFriendId, _ => {

                if (sockets[userId].matchmaking.duelArray[userFriendId] == null) {

                    sockets[userId].matchmaking.duelArray[userFriendId] = {

                        'status': MatchmakingStatus.IsWaiting
                    }

                    send_duel(userId, { status: MatchmakingStatus.IsWaiting })

                } else {

                    switch (sockets[userId].matchmaking.duelArray[userFriendId].status) {
                        case MatchmakingStatus.IsWaited:

                            sockets[userId].matchmaking.duelArray[userFriendId] = {
                                'status': MatchmakingStatus.InMatch
                            }

                            sockets[userFriendId].matchmaking.duelArray[userId] = {
                                'status': MatchmakingStatus.InMatch
                            }

                            send_fight(userId, userFriendId, { status: MatchmakingStatus.InMatch, userId, userFriendId })
                            return;
                            break;
                        case MatchmakingStatus.IsWaiting:
                            send_duel(userId, { status: MatchmakingStatus.IsWaiting })
                            break;
                        case MatchmakingStatus.Cancelled:

                            sockets[userId].matchmaking.duelArray[userFriendId] = {
                                'status': MatchmakingStatus.IsWaiting
                            }

                            send_duel(userId, { status: MatchmakingStatus.IsWaiting })

                            break;
                        case MatchmakingStatus.InMatch:
                            send_duel(userId, { status: MatchmakingStatus.InMatch })
                            //console.log("Already fighting")
                            break;
                        default:
                            console.error(`userFriendId status of socket : ${userId} is null or wrong Type`)
                            break;
                    }
                }


                if (sockets[userFriendId].matchmaking.duelArray[userId] == null) {

                    sockets[userFriendId].matchmaking.duelArray[userId] = {
                        'status': MatchmakingStatus.IsWaited
                    }

                    send_duel(userFriendId, { status: MatchmakingStatus.IsWaited })

                } else {

                    switch (sockets[userFriendId].matchmaking.duelArray[userId].status) {
                        case MatchmakingStatus.IsWaited:

                            send_duel(userFriendId, { status: MatchmakingStatus.IsWaited })
                            break;
                        case MatchmakingStatus.IsWaiting:

                            sockets[userFriendId].matchmaking.duelArray[userId] = {
                                'status': MatchmakingStatus.InMatch
                            }

                            sockets[userId].matchmaking.duelArray[userFriendId] = {
                                'status': MatchmakingStatus.InMatch
                            }

                            send_fight(userFriendId, userId, { status: MatchmakingStatus.InMatch, userId, userFriendId })
                            return;
                            break;
                        case MatchmakingStatus.Cancelled:

                            sockets[userFriendId].matchmaking.duelArray[userId] = {
                                'status': MatchmakingStatus.IsWaited
                            }
                            send_duel(userFriendId, { status: MatchmakingStatus.IsWaited })

                            break;
                        case MatchmakingStatus.InMatch:
                            send_duel(userFriendId, { status: MatchmakingStatus.InMatch })
                            break;
                        default:
                            console.error(`userId status of socket : ${userFriendId} is null or wrong Type`)
                            break;
                    }
                }

            })

            
        })


    })
}


export function MF_Cancel(socket){

    socket.on('matchmakingFriend-cancel', (dataUsers) => {
        let userId = dataUsers?.userId
        let userFriendId = dataUsers?.userFriendId

        checkUser(userId,userFriendId,_=>{
        
            if (sockets[userId].matchmaking.duelArray[userFriendId] != null) {

                if(sockets[userId].matchmaking.duelArray[userFriendId].status == MatchmakingStatus.IsWaiting){

                    sockets[userId].matchmaking.duelArray[userFriendId] = {
                        'status': MatchmakingStatus.Cancelled
                    }

                    sockets[userFriendId].matchmaking.duelArray[userId] = {
                        'status': MatchmakingStatus.Cancelled
                    }
                    send_cancel(userId,{status :  MatchmakingStatus.Cancelled })
                }
            }        

        })
    })


}

function checkUser(userId, callback){


  

    if (userId == null || typeof userId !== 'string') {
        console.error("Missing userId or wrong type : ", userId)
        return;
    }

    if (sockets[userId] == null || typeof sockets[userId] !== 'object') {
        console.error("Missing socket of userId or wrong type at Socket.matchmakingFriend")
        return;
    }

 
    

    if(typeof callback === 'function'){
        callback();
    } 
}



function send_duel(_id,data){
    //console.log(sockets[_id].matchmaking)
    sockets[_id].emit('matchmakingFriend-duel',(data))
}

function send_fight(_id1,_id2,data){
    //console.log(sockets[_id1].matchmaking)
    //console.log(sockets[_id2].matchmaking)
    sockets[_id1].emit('matchmakingFriend-fight',(data))
    sockets[_id2].emit('matchmakingFriend-fight',(data))
}

function send_cancel(_id,data){
    //console.log(sockets[_id].matchmaking)
    sockets[_id].emit('matchmakingFriend-cancel',(data))
}