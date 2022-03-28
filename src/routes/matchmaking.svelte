<link rel='stylesheet' href='static/css/matchmaking.css'>


<script>
import { goto } from '$app/navigation';
import { onDestroy, onMount } from 'svelte/internal';
import { io } from "$lib/realtime";
import { user, dataMatch } from './auth';
import Loader from '../components/loader.svelte';


    var txt = ""

    function cancelMatchmaking() {
        goto('/')
    }

    loopText()

    var lock = false
    function loopText() {
        if (txt.length < 3 && lock == false) {
            txt += "."
            if(txt.length == 3) {
                lock = true
            }
            setTimeout(loopText, 1000)
        } else {
            if(txt.length == 1) {
                lock = false
            }
            txt = txt.substring(0, txt.length - 1)
            setTimeout(loopText, 1000)
        }
    }

    io.on('matchmakingSearch', (data) => {
        $dataMatch = data
        goto('/fight')
    })

    onMount(() => {
        io.emit('matchmakingSearch', $user)
    })

    onDestroy(() => {
        io.emit('matchmakingLeave', $user)
    })

</script>

<Loader></Loader>

<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-full flex flex-col ">
        <div class='content-center w-1/4 mx-auto mt-6'>
            <img src='static/assets/memstone_logo.png' class='img-contain'>
        </div>
        <div class="divmatch">


        <div class="flex flex-row">
            <div class="w-full">
                En recherche de matchmaking
            </div>
            <div class="w1/4">
                {txt}
            </div>
        </div>
            
        </div>
        <div on:click={cancelMatchmaking} class="ButtonExit buttonDetail">
            Annuler
        </div>
    </div>
</div>