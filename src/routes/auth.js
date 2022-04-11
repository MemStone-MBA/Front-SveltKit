import { writable } from 'svelte/store';
import {ConnexionStatus} from '../lib/Status.js';

export const user = writable(null);

export const dataMatch = writable({});

export const connexionStatusWritable = writable(ConnexionStatus.Error)

export const isLog = function(user) {
    if(user != null) {
        return true
    } else {
        return false
    }
}