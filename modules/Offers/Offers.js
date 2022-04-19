import axios from 'axios';
import { LogsError } from '../log.js';
import { removeProps } from '../Utils.js'


export const getOffers = async function(data) {
	let conf = await process;
	var res = await axios.get(  conf.env.URL+'offers' , {
		headers: { "Authorization": "Bearer " + data.jwt, handler : "offers.find"},
	}).then((res) => {
		//console.log(res)
		return res
	}).catch(err => {
	//	console.log(err)
		LogsError(err);
		return err


	})

	if(res== undefined){
		LogsError(new Error("res is undefined, .env might send wrong url or does not exist"))
		return ;
	}

	let allOffers = {
		status:400,
		count:0,
		offers:[]
	}


	res.status = res.status ? res.status : res.response.status;
	allOffers.status = res.status;
	switch (res.status){
		case 400:

			break;
		case 403:

			LogsError(res)
			break;
		case 200:
			allOffers.offers =  removeProps(res.data,['updated_by','created_by','createdAt','updatedAt','__v','_id'])
			allOffers.count = allOffers?.offers.length;
			break;
		default:
			LogsError(res)
			break
	}

	return allOffers;

}
