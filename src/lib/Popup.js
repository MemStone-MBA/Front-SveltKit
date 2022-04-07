import { writable } from 'svelte/store';


export const popupTextWritable= writable("test")

export const popupAcceptWritable = writable(() => {
        console.log("accept")
    })
export const popupDenyWritable = writable(() => {
        console.log("deny")
    }
)