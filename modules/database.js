import axios from "axios";
import { user } from '../src/routes/auth.js';


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
        cb(null)
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
    me(response.data.jwt, cb)
  }).catch(error => {
    /**
     * Email already used / password not enought strong
     */
    cb(null)
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
        cb(res.data)
    }).catch((error) => {
        cb(null)
    });
}


export const getAllCards = async function(jwt) {
	let conf = await process;
    var response = axios.get(  conf.env.URL+'card', {

        headers: { "Authorization": "Bearer " + jwt}
    }).then((res) => {

        return res.data
    })

    return response
}

export const getCardById = async function(jwt, cardID) {
	let conf = await process;
    var response = axios.get(conf.env.URL+'card/' + cardID , {
        headers: { "Authorization": "Bearer " + jwt}
    }).then((res) => {
        return res.data
    })
    return response
}

export const getCardsByUser = async function(jwt, userId) {



    let conf = await process;
    var response = axios.get(  conf.env.URL+'inventory/user/' +userId, {

        headers: { "Authorization": "Bearer " + jwt, handler : "inventory.findUserCard"},

    }).then((res) => {

        return res.data
    })

    return response
}


