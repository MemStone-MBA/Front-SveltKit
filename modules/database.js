import axios from "axios";
import { user } from '../src/routes/auth.js';
import { LogsError } from './log.js'
import { removeProps } from './Utils.js';

const parseJSON = (resp) => (resp.json ? resp.json() : resp);

const checkStatus = (resp) => {
    if (resp.status >= 200 && resp.status < 300) {
    return resp;
    }
    return parseJSON(resp).then((resp) => {
    throw resp;
    });
};

export async function login(mail, password, cb) {

    
    axios.post(process.env.URL + 'auth/local', {
        identifier: mail,
        password: password,
    }).then(response => {
        /**
         * Auth OK
         */
         
        me(response.data.jwt, cb)
    }).catch(error => {
        /**
         * Auth not OK
         */
        LogsError(error);
        cb(error)
    });
}

export async function register(username, mail, password, cb) {

    axios.post(process.env.URL + 'auth/local/register', {
    username: username,
    email: mail,
    password: password,
  }).then(response => {
      /**
       * Register OK
       */
    me( response.data.jwt, cb)
  }).catch(error => {
    /**
     * Email already used / password not enought strong
     */
      LogsError(error);
    cb(error)
  });
 
}

export async function get(table) {
    try {
        const res = await fetch(process.env.URL + table, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        }).then(checkStatus)
    .then(parseJSON);
        return res
    } catch (e) {
        LogsError(e);
        return e
    }
}

export function me(jwt, cb) {

    const config = {
        headers: { Authorization: `Bearer ${jwt}` }
    };
    
    axios.get(process.env.URL + 'users/me',
      config
    ).then((res) => {
        res.data.jwt = jwt
        cb(res)
    }).catch((error) => {
        LogsError(error);
        cb(error)
    });
}


export const getAllCards = async function(jwt) {
	let conf = await process;
    var response = axios.get(  conf.env.URL+'card', {

        headers: { "Authorization": "Bearer " + jwt}
    }).then((res) => {

        return res.data
    }).catch(err => {
        LogsError(err);
    })

    return response
}

export const getCardById = async function(jwt, cardID) {
	let conf = await process;
    var response = axios.get(conf.env.URL+'card/' + cardID , {
        headers: { "Authorization": "Bearer " + jwt}
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}

export const getCaseById = async function(jwt, caseID) {
	let conf = await process;
    var response = axios.get(conf.env.URL+'cases/' + caseID , {
        headers: { "Authorization": "Bearer " + jwt}
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}

export const createDeck = async function(jwt, idUser, cb) {
	let conf = await process;
    var response = axios.post(conf.env.URL+'deck/', {
        idUser: idUser,
        listCards: []
    }, {
        headers: { "Authorization": "Bearer " + jwt}
    }).then((res) => {
        res.data
        cb()
    }).catch(err => {
        LogsError(err);
        cb()
    })
    response
}

export const getCardsByUser = async function(jwt, userId) {
    let conf = await process;
    var response = axios.get(  conf.env.URL+'inventory/user/' +userId, {
        headers: { "Authorization": "Bearer " + jwt, handler : "inventory.findUserCard"},
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })

    return response
}


export const getDeckByUser = async function(jwt, userId) {
    let conf = await process;
    var response = axios.get(  conf.env.URL+'deck/user/' +userId, {
        headers: { "Authorization": "Bearer " + jwt, handler : "deck.findUserDeck"},
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}

export const getFriendsByUser = async function(jwt, userId) {
    let conf = await process;
    var response = axios.get(  conf.env.URL+'users-friends/user/' +userId, {
        headers: { "Authorization": "Bearer " + jwt, handler : "users-friend.findUserFriends"},
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}

export const getUserById = async function(jwt, userId) {
    let conf = await process;
    var response = axios.get(  conf.env.URL+'users/' +userId, {
        headers: { "Authorization": "Bearer " + jwt, handler : "users-friend.findUserFriends"},
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}

export const getUserByUsername = async function(jwt,id, username) {
    let conf = await process;
    console.log(conf.env.URL+'users-friends/user/' +username +"/"+ id)
    var response = axios.get(  conf.env.URL+'users-friends/user/' +username +"/"+ id, {
        headers: { "Authorization": "Bearer " + jwt},
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}

export const saveDeckByUser = async function(jwt, deck) {
    let conf = await process;

    var response = axios.put(  conf.env.URL+'deck/' +deck.id, {'listCards': deck.listCards},{
        headers: { "Authorization": "Bearer " + jwt, handler : "deck.update"},
    }).then((res) => {
        //console.log(res)
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}


export const insertNewCardInventory = async function(jwt, userId, cardId) {
    let conf = await process;

    var res = await axios.post(  conf.env.URL+'inventory/', {
        'idUser':userId,
        'idCard': cardId
    },{
        headers: { "Authorization": "Bearer " + jwt, handler : "deck.update"},
    }).then((res) => {
        return res
    }).catch(err => {
        LogsError(err);
        return err;
    })

    if(res== undefined){
        LogsError(new Error("res is undefined, .env might send wrong url or does not exist"))
        return ;
    }

    let result = {
        status:400,
        data:[]
    }

    res.status = res.status ? res.status : res.response.status;
    result.status = res.status;
    switch (res.status){
        case 400:

            break;
        case 403:
            LogsError(res)
            break;
        case 200:
            result = { ...removeProps(res.data,['createdAt','updatedAt','_id','__v','_id']), ...result}

            break;
        default:
            LogsError(res)
            break
    }


    return result
}

export const buyCoins = async function(user, amount) {
    let conf = await process;

    var newAmount = user.coins + amount

    var response = axios.put(  conf.env.URL+'users/' +user.id, {'coins': newAmount},{
        headers: { "Authorization": "Bearer " + user.jwt, handler : "deck.update"},
    }).then((res) => {
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
}

export const updateUserMMR = async function(user, id, mmr, xp, coins) {
    let conf = await process;
    return getUserById(user.jwt, id).then(res => {
        var newMMR = res.mmr + mmr

        if(newMMR < 0) {
            newMMR = 0
        }

        var newWin = res.game_win, newLose = res.game_lose

        if(mmr > 0) {
            newWin = res.game_win + 1
        } else {
            newLose = res.game_lose + 1
        }

        console.log(res.Level + xp)

        var response = axios.put(  conf.env.URL+'users/' +id, {
            'mmr': newMMR,
            'game_win': newWin,
            'game_lose': newLose,
            'Level': res.Level + xp,
            'coins': res.coins + coins
        },{
            headers: { "Authorization": "Bearer " + user.jwt},
        }).then((res) => {
            return res.data
        }).catch(err => {
            LogsError(err);
        })
        return response
    })
}

