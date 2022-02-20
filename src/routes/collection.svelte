<link rel='stylesheet' href='static/css/index.css'>
<script>
    import { user } from './auth.js'
    import { onMount } from 'svelte';
    import { getCards } from './database';
    import axios from 'axios';

    const SERVER = "http://51.210.104.99:8001/"
    var cardsTitle = "Cards "

    var cards = []

    getCards().then((resp) => {
        cardsTitle = "Cards (" + resp.length + ")"
        cards = resp
    })

</script>

<link rel='stylesheet' href='static/css/collection.css'>

<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-full flex flex-row ">
       <div class="colorbackfriend w-1/4 mr-10 flex flex-col">
            <div class="text-center titleCollection m-2">Deck</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll">container cards</div>
            <div class="flex justify-center">
                <div class="buttonSave buttonDetail p-4 m-6">Retour</div>
            </div>
       </div>

       <div class="colorbackfriend flex-1 flex flex-col">
            <div class="text-center titleCollection m-2">{ cardsTitle }</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll flex flex-wrap justify-center">
                
                
                {#each cards as img}
                    <div><img src="http://51.210.104.99:8001/getImage/{img.path}" class="p-2"></div>
                {/each}

            </div>
            <div class="flex justify-center">
                <div class="buttonSave buttonDetail p-4 m-6">Sauvegarder</div>
            </div>
       </div>
    </div>
</div>