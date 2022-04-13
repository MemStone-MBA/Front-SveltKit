import { writable } from 'svelte/store';
import {ConnexionStatus} from '../lib/Status.js';

export const user = writable(null);

export const dataMatch = writable({});

export const connexionStatusWritable = writable(ConnexionStatus.Error)

export const loaderStatusWritable = writable(false)

export const userCasesWritable = writable({status:400,cases:[],count:0})

export const userCardObtained = writable(null)


export const isLog = function(user) {
    if(user != null) {
        return true
    } else {
        return false
    }
}