import { Status, MatchmakingStatus } from "./Status.js";
import { sockets } from "../socket.js";
import { getDeckByUser, getUserById } from "../database.js";


export function MF_Initialize(socket) {
    socket.matchmaking = { 'duelArray': [] }
    return socket
}


export function MF_Fight(socket){
	socket.on('matchmakingFriend-duel', (dataUsers) => {

        let userId = dataUsers?.userId
        let userFriendId = dataUsers?.userFriendId 
        let jwt = dataUsers?.jwt   

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


                            send_fight(userFriendId, userId, {
                            
                                'actualUser': {
                                    'id': userId,
                                    'status': Status.Connected,
                                    'matchmakingStatus': MatchmakingStatus.InMatch
                                },
                                'selectedUser': {
                                    'id': userFriendId,
                                    'status': friendStatus,
                                    'matchmakingStatus': MatchmakingStatus.InMatch
                                }
                            },jwt)

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


                            send_fight(userFriendId, userId, {
                                
                                'selectedUser': {
                                    'id': userId,
                                    'status': Status.Connected,
                                    'matchmakingStatus': MatchmakingStatus.InMatch
                                },
                                'actualUser': {
                                    'id': userFriendId,
                                    'status': friendStatus,
                                    'matchmakingStatus': MatchmakingStatus.InMatch
                                }
                            },jwt)
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
                        send_duel(userId, { status: Status.Connected, matchmakingStatus: MatchmakingStatus.Cancelled })
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

function send_fight(_id1,_id2,data,jwt){
    let user1 = {}
    let user2 = {}
    let deck_user1 = {}
    let deck_user2 = {}

    let promises = []

    promises.push(
        getUserById(jwt, _id1).then((res) => {
            user1 = res
        })
    )

    promises.push(
        getUserById(jwt, _id2).then((res) => {
            user2 = res
        })
    )

    promises.push(
        getDeckByUser(jwt, _id1).then((res) => {
            deck_user1 = res
        })
    )

    promises.push(
        getDeckByUser(jwt, _id2).then((res) => {
            deck_user2 = res
        })
    )

    Promise.all(promises).then((res) => {
        var LIFE = 20
        var MANA = 0
        var MANA_REGEN = 0
        var TIME_ROUND = 25 
        var MAX_MANA = 10

        var GAME = {
            "maxMana": MAX_MANA,
            "time_round": TIME_ROUND,
            "turn": user1.id,
            [user1.id]: {
                user: user1,
                deck: deck_user1,
                life: LIFE,
                mana: MANA,
                manaRegen: MANA_REGEN,
            },
            [user2.id]: {
                user: user2,
                deck: deck_user2,
                life: LIFE,
                mana: MANA,
                manaRegen: MANA_REGEN,
            },
            changeTurn : () => {
                this.turn = this.turn == user1.id ? user2.id : user1.id;
            }
        }

        sockets["GAME_" + user1.id + "_" + user2.id] = GAME

        data.game = GAME;
        sockets[_id1].emit('matchmakingFriend-fight',(data))
        sockets[_id2].emit('matchmakingFriend-fight',(data))
    })
    
}

