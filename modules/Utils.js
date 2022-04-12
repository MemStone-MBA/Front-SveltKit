import { LogsError } from './log.js';

export function removeProps(data,props){

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