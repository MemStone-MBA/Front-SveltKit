import axios from 'axios';
import { LogsError } from '../log.js';
import { removeProps } from '../Utils.js'

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

	let usersCases = []

	res.status = res.status ? res.status : res.response.status;
	allCases.status = res.status;
	switch (res.status){
		case 400:

			break;
		case 403:

			LogsError(res)
			break;
		case 200:
			usersCases=  removeProps(res.data,['updated_by','created_by','createdAt','updatedAt','__v','_id'])
			allCases.totalAmount = usersCases?.length;
			break;
		default:
			LogsError(res)
			break
	}

	if (usersCases.length>0){

		let casesId = []
		let caseFetch = []

		usersCases.map((value) => {
			if (!casesId.includes(value.idCase))
				casesId.push(value.idCase)
		})

		casesId.forEach(caseId=>{
			caseFetch.push(axios.get(conf.env.URL+'cases/' + caseId , {
					headers: { "Authorization": "Bearer " + data.jwt}
				}).then((res) => {
					return res
				}).catch(err => {
					return err
				})
			)
		})

		await  Promise.all(caseFetch).then((allRes)=>{

			allRes.forEach(res =>{

				let casePatern = {
					status:400,
					count:0,
					userCases:[]
				}
				res.status = res.status ? res.status : res.response.status;
				casePatern.status = res.status;
				switch (res.status){
					case 400:
						break;
					case 403:
						LogsError(res)
						break;
					case 200:
						casePatern = { ...removeProps(res.data,['createdAt','updatedAt','_id','__v','_id']), ...casePatern }
						usersCases.map(userCase=>{

							if (userCase.idCase == casePatern.id)
								casePatern.userCases.push(userCase);

						})
						casePatern.count =casePatern.userCases.length;
						allCases.cases.push(casePatern)
						break;
					default:
						LogsError(res)
						break
				}
			})

		})

	}

	return allCases;

}


export const deleteUserCase = async function(jwt, caseId) {
	let conf = await process;
	var res = await axios.delete(  conf.env.URL+'users-cases/' +caseId, {
		headers: { "Authorization": "Bearer " + jwt, handler : "users-cases.delete"},
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

	let result = {
		status:400,

	}

	res.status = res.status ? res.status : res.response.status;
	switch (res.status){
		case 400:

			break;
		case 403:
			LogsError(res)
			break;
		case 200:

			break;
		default:
			LogsError(res)
			break
	}

	return  result
}


export const addUserCase = async function(jwt, baseCaseId, userId) {
	let conf = await process;
	var res = await axios.post(  conf.env.URL+'users-cases', {
		idUser:userId,
		idCase:baseCaseId
	},{
		headers: { "Authorization": "Bearer " + jwt, handler : "users-cases.create"},
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

	return  result
}