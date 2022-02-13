import axios from "axios";

const parseJSON = (resp) => (resp.json ? resp.json() : resp);

const checkStatus = (resp) => {
    if (resp.status >= 200 && resp.status < 300) {
    return resp;
    }
    return parseJSON(resp).then((resp) => {
    throw resp;
    });
};

const URL = "http://51.210.104.99:1337/"
// const URL = "http://localhost:1337/"

export async function login(mail, password, cb) {

    axios.post(URL + 'auth/local', {
        identifier: mail,
        password: password,
    }).then(response => {
        /**
         * Auth OK
         */
        cb(response.data.user)
    }).catch(error => {
        /**
         * Auth not OK
         */
        cb(null)
    });
}

export async function register(username, mail, password, cb) {

    axios.post(URL + 'auth/local/register', {
    username: username,
    email: mail,
    password: password,
  }).then(response => {
      /**
       * Register OK
       */
    cb(response.data.user)
  }).catch(error => {
    /**
     * Email already used / password not enought strong
     */
    cb(null)
  });
 
}

export async function get(table) {
    try {
        const res = await fetch(URL + table, {
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

