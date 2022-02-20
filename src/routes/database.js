import axios from "axios"

const IMAGE_SERVER = "http://51.210.104.99:8001/"
const STRAPI = "http://51.210.104.99:1337/"

export const getCards = async function() {
    var response = await axios.post(STRAPI + 'auth/local', {
        identifier: "test",
        password: "Azerty123.",
    }).then(response => {
        /**
         * Auth OK
         */
        return axios.get(STRAPI + 'card', {
            headers: { "Authorization": "Bearer " + response.data.jwt}
        }).then((res) => {
            return res.data
        })
    }).catch(error => {
        console.log(error)
    });

    return response
} 

