<link rel='stylesheet' href='static/css/matchmaking.css'>


<script>
    import { goto } from '$app/navigation';
    import { loop, onMount } from 'svelte/internal';
    import { io } from "$lib/realtime";


    var txt = ""

    function cancelMatchmaking() {
        goto('/')
    }

    loopText()

    var lock = false
    function loopText() {
        // until txt length is lesser then 3 join . to txt
        if (txt.length < 3 && lock == false) {
            txt += "."
            if(txt.length == 3) {
                lock = true
            }
            //document.querySelector('.matchmaking-text').innerHTML = txt
            setTimeout(loopText, 1000)
        } else {
            if(txt.length == 1) {
                lock = false
            }
            // if txt length is greater then 3 remove . from txt
            txt = txt.substring(0, txt.length - 1)
            //document.querySelector('.matchmaking-text').innerHTML = txt
            setTimeout(loopText, 1000)
        }
    }

    onMount(() => {
        io.emit('matchmakingSearch')
    })

</script>


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