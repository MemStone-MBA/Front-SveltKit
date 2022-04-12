import axios from "axios";
import { user } from '../src/routes/auth.js';
import { LogsError } from './log.js'

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

function me(jwt, cb) {

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

export const getUserCases = async function(data) {
    let conf = await process;
    var res = await axios.get(  conf.env.URL+'users-cases/user/' +data.userId, {
        headers: { "Authorization": "Bearer " + data.jwt, handler : "users-cases.findUserCase"},
    }).then((res) => {
        return res
    }).catch(err => {
        LogsError(err);
        return err


    })

    if(res== undefined){
        LogsError(new Error("res is undefined, .env might send wrong url or does not exist"))
        return ;
    }

    let allCases = {
        status:400,
        totalAmount:0,
        cases:[]
    }

    res.status = res.status ? res.status : res.response.status;
    allCases.status = res.status;
    switch (res.status){
        case 400:

        break;
        case 403:

            LogsError(res)
            break;
        case 200:
            allCases.cases =  removeProps(res.data,['updated_by','created_by','createdAt','updatedAt','_id'])
            allCases.totalAmount = allCases?.cases.length;
            break;
        default:
            LogsError(res)
            break
    }

    let caseTypes = []

    allCases?.cases.map((value) => {
        if (!caseTypes.contains(value.id))
            caseTypes.push(value.id)
    })
    console.log(allCases)


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

    var response = axios.post(  conf.env.URL+'inventory/', {
        'idUser':userId,
        'idCard': cardId
    },{
        headers: { "Authorization": "Bearer " + jwt, handler : "deck.update"},
    }).then((res) => {
        //console.log(res)
        return res.data
    }).catch(err => {
        LogsError(err);
    })
    return response
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


function removeProps(data,props){

    if (Array.isArray(data)){

        data?.forEach(d =>{
            d = remove(d)
        })

    }else  if (typeof data === 'object'){

        remove(data)

    }
    else {
        LogsError(new Error("data from removeProps in database is wrong type"))
    }



    function remove(localData){
        if (Array.isArray(props)){
            props?.forEach(prop=>{
                if (typeof prop === 'string'){
                    delete localData[prop];
                }else {
                    LogsError(new Error("removeProps in database didnt found props"))
                }
            })
        }else {

            if (typeof props === 'string'){
                delete localData[props];
            }else {
                LogsError(new Error("removeProps in database didnt found props"))
            }


        }

        return localData
    }



    return data

}