
import { writable } from 'svelte/store';
import {ConnexionStatus} from '../lib/Status.js';


export const user = writable(null);

export const dataMatch = writable({});

export const connexionStatusWritable = writable(ConnexionStatus.Error)

export const loaderStatusWritable = writable(true)

export const userCasesWritable = writable({status:400,cases:[],count:0})

export const userCardObtained = writable(null)



export 	function setLoader(loaderVal){
    loaderStatusWritable.update(value =>  value = loaderVal)
}

export function isLog(res,err){
    user.subscribe(value => {
        //User loaded

        if (value == null)
            err()
        else {

            res(_=>{
                setLoader(false)
            })


        }
    })
}

