import { writable } from 'svelte/store';

export const user = writable(null);

export const isLog = function(user) {
    if(user != null) {
        return true
    } else {
        return false
    }
}