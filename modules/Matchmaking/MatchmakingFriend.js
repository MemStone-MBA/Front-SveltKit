import { Status } from "./MatchmakingStatus.js";
import { sockets } from "../socket.js";


export function MF_Fight(socket){
	socket.on('matchmakingFriend-duel', (dataUsers) => {

        let userId = dataUsers?.userId
        let userFriendId = dataUsers?.userFriendId

        checkUsers(userId,userFriendId,_=>{

            if (sockets[userId].matchmaking.duelArray[userFriendId] == null) {

                sockets[userId].matchmaking.duelArray[userFriendId] = {
                    'status': Status.IsWaiting
                }
    
                send_duel(userId,{status :  Status.IsWaiting })

            } else {
    
                switch (sockets[userId].matchmaking.duelArray[userFriendId].status) {
                    case Status.IsWaited:

                        sockets[userId].matchmaking.duelArray[userFriendId] = {
                            'status': Status.InMatch
                        }

                        sockets[userFriendId].matchmaking.duelArray[userId] = {
                            'status': Status.InMatch
                        }

                        send_fight(userId,userFriendId,{status:Status.InMatch ,userId, userFriendId})
                        return;
                        break;
                    case Status.IsWaiting:
                        send_duel(userId, {status :  Status.IsWaiting })
                        break;
                    case Status.Cancelled:

                        sockets[userId].matchmaking.duelArray[userFriendId] = {
                            'status': Status.IsWaiting
                        }

                        send_duel(userId, {status :  Status.IsWaiting })
                     
                        break;
                    case Status.InMatch:
                        send_duel(userId, {status :  Status.InMatch })
                        //console.log("Already fighting")
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
    
                send_duel(userFriendId,{status :  Status.IsWaited })
    
            } else {
    
                switch (sockets[userFriendId].matchmaking.duelArray[userId].status) {
                    case Status.IsWaited:
                       
                        send_duel(userFriendId,{status :  Status.IsWaited })
                        break;
                    case Status.IsWaiting:

                        sockets[userFriendId].matchmaking.duelArray[userId] = {
                            'status': Status.InMatch
                        }

                        sockets[userId].matchmaking.duelArray[userFriendId] = {
                            'status': Status.InMatch
                        }

                        send_fight(userFriendId,userId,{status:Status.InMatch ,userId, userFriendId})
                        return;
                        break;
                    case Status.Cancelled:

                        sockets[userFriendId].matchmaking.duelArray[userId] = {
                            'status': Status.IsWaited
                        }
                        send_duel(userFriendId,{status :  Status.IsWaited })
                   
                        break;
                    case Status.InMatch:
                        send_duel(userFriendId,{status :  Status.InMatch })
                        break;
                    default:
                        console.error(`userId status of socket : ${userFriendId} is null or wrong Type`)
                        break;
                }
            }
        })


    })
}


export function MF_Cancel(socket){

    socket.on('matchmakingFriend-cancel', (dataUsers) => {
        let userId = dataUsers?.userId
        let userFriendId = dataUsers?.userFriendId

        checkUsers(userId,userFriendId,_=>{
        
            if (sockets[userId].matchmaking.duelArray[userFriendId] != null) {

                if(sockets[userId].matchmaking.duelArray[userFriendId].status == Status.IsWaiting){

                    sockets[userId].matchmaking.duelArray[userFriendId] = {
                        'status': Status.Cancelled
                    }

                    sockets[userFriendId].matchmaking.duelArray[userId] = {
                        'status': Status.Cancelled
                    }
                    send_cancel(userId,{status :  Status.Cancelled })
                }
            }        

        })
    })


}

function checkUsers(userId,userFriendId, callback){

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