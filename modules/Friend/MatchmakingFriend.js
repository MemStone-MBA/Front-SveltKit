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

                setUserStatus(userId,userFriendId ,friendStatus )
                setUserStatus(userFriendId, userId ,Status.Connected )

                send_duel(userId, { 'status' : Status.Connected ,'matchmakingStatus': MatchmakingStatus.Cancelled  })
                return;
            }

            checkUser(userFriendId, _ => {

                if (sockets[userId].matchmaking.duelArray[userFriendId] == null) {

                    setUserStatus(userId,userFriendId ,Status.Connected , MatchmakingStatus.IsWaiting)

                    send_duel(userId, { 'status' : friendStatus, 'matchmakingStatus': MatchmakingStatus.IsWaiting })

                } else {

                    switch (sockets[userId].matchmaking.duelArray[userFriendId].matchmakingStatus) {
                        case MatchmakingStatus.IsWaited:

                            setUserStatus(userId,userFriendId ,Status.Connected , MatchmakingStatus.InMatch)
                            setUserStatus(userFriendId, userId , friendStatus ,  MatchmakingStatus.InMatch )


                            send_fight(userId, userFriendId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.InMatch, userId, userFriendId })
                            return;
                            break;
                        case MatchmakingStatus.IsWaiting:
                            send_duel(userId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.IsWaiting })
                            break;
                        case MatchmakingStatus.Cancelled:

                            setUserStatus(userId,userFriendId ,Status.Connected , MatchmakingStatus.IsWaiting)
                      

                            send_duel(userId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.IsWaiting })

                            break;
                        case MatchmakingStatus.InMatch:
                            send_duel(userId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.InMatch })
                            //console.log("Already fighting")
                            break;
                        default:
                            console.error(`userFriendId matchmakingStatus of socket : ${userId} is null or wrong Type`)
                            break;
                    }
                }


                if (sockets[userFriendId].matchmaking.duelArray[userId] == null) {

                  

                    setUserStatus(userFriendId ,userId ,friendStatus , MatchmakingStatus.IsWaited)

                    send_duel(userFriendId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.IsWaited })

                } else {

                    switch (sockets[userFriendId].matchmaking.duelArray[userId].matchmakingStatus) {
                        case MatchmakingStatus.IsWaited:

                            send_duel(userFriendId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.IsWaited })
                            break;
                        case MatchmakingStatus.IsWaiting:


                            setUserStatus(userId,userFriendId ,Status.Connected , MatchmakingStatus.InMatch)
                            setUserStatus(userFriendId, userId , friendStatus ,  MatchmakingStatus.InMatch )


                            send_fight(userFriendId, userId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.InMatch, userId, userFriendId })
                            return;
                            break;
                        case MatchmakingStatus.Cancelled:


                            setUserStatus(userFriendId, userId , friendStatus ,  MatchmakingStatus.IsWaited )
                            send_duel(userFriendId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.IsWaited })

                            break;
                        case MatchmakingStatus.InMatch:
                            send_duel(userFriendId, {'status' : friendStatus, matchmakingStatus: MatchmakingStatus.InMatch })
                            break;
                        default:
                            console.error(`userId matchmakingStatus of socket : ${userFriendId} is null or wrong Type`)
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

        checkUser(userId,_=>{
        
            checkUser(userFriendId,_=>{
                if (sockets[userId].matchmaking.duelArray[userFriendId] != null) {

                    if(sockets[userId].matchmaking.duelArray[userFriendId].matchmakingStatus == MatchmakingStatus.IsWaiting){

                        sockets[userId].matchmaking.duelArray[userFriendId].matchmakingStatus = MatchmakingStatus.Cancelled;
                        sockets[userFriendId].matchmaking.duelArray[userId].matchmakingStatus = MatchmakingStatus.Cancelled;

                        send_cancel(userId,{matchmakingStatus :  MatchmakingStatus.Cancelled })
                    }
                }        
            })
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

function setUserStatus(userId, userFriendId, status, matchmakingStatus = MatchmakingStatus.Cancelled){
    checkUser(userId,_=>{

        if(typeof status === 'string'){

            if(typeof matchmakingStatus === 'string'){

                sockets[userId].matchmaking.duelArray[userFriendId] = {
                    'status': status,
                    'matchmakingStatus':matchmakingStatus
                }
            }

        }

    })
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