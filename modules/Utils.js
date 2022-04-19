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

export function draw(chest, cb) {
	let total = 0
	let cards = []

	for(let element in chest) {

		cards.push({
			id:element,
			min:total,
			max:total+(chest[element] - 1)
		})
	 	total += parseInt(chest[element]);
	}

	let randomDraw = randomNb(0, total + 1)

	// console.log("randomDraw : ",randomDraw)
	// console.log("cards : ",cards)

	for (let card of cards){
		if (randomDraw >= card.min && randomDraw <= card.max){
			// console.log("drawed")
			cb(card.id)
			return;
		}
	}


}

export function randomNb(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}