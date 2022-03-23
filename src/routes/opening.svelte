<link rel='stylesheet' href='static/css/index.css'>
<script>
    import Loader from '../components/loader.svelte';
    import { user } from './auth'
    import { goto } from '$app/navigation';
    import { onDestroy, onMount } from 'svelte';
    import { io } from "$lib/realtime";

    var CHEST = {
        "62115ed3457d2c67b6a0dda4": 10,
        "62115ef8457d2c67b6a0dda5": 300,
        "62115e48457d2c67b6a0dda2": 2000,
        "62115eb7457d2c67b6a0dda3": 3000,
    }

    var CHEST_EQ = {
        "62115ed3457d2c67b6a0dda4": 1000,
        "62115ef8457d2c67b6a0dda5": 1000,
        "62115e48457d2c67b6a0dda2": 1000,
        "62115eb7457d2c67b6a0dda3": 1000,
    }

    var drawCardController = true;
    var drawCardPath;

    onMount(() => {
        draw(CHEST, ((cardID) => {
            io.emit('getCardById', {jwt:$user.jwt, userId: $user.id, cardId: cardID}, ((res) => {
                drawCardPath = res.path
                drawCardController = false
                dismissCard()
            }))

           io.emit('drawNewCard', {jwt:$user.jwt, userId: $user.id, cardId: cardID})
        }))
    })

    function draw(chest, cb) {
        let total = 0

        for(let element in chest) {
            total += chest[element]
        }

        let randomDraw = randomNb(1, total + 1)

        for(let element in chest) {
            total += chest[element]
        }

        var arrayChestKey = Object.keys(chest)
        var arrayChestValue = Object.values(chest)
        var chestLength = arrayChestKey.length

        var min = 0

        for(let i = 0; i < chestLength; i++) {

            if(min < randomDraw && randomDraw <= (min + arrayChestValue[i])) {
                cb(arrayChestKey[i])
                break
            }
            min = min + arrayChestValue[i]
        }
    }

    function goToMenu() {
        goto('/')
    }

    function randomNb(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
    }

    var toDisplay, toMenu;

    function dismissCard() {
        toDisplay = setTimeout(() => {
            document.querySelector('.cardContainer').classList.remove("fadeDisplay")
        }, 3500);

        toMenu = setTimeout(() => {
            goToMenu()
        }, 60000);
    }

    onDestroy(() => {
        clearTimeout(toDisplay)
        clearTimeout(toMenu)
    })

</script>

<link rel='stylesheet' href='static/css/collection.css'>

<Loader wait={drawCardController}></Loader>

{#if !drawCardController}
<div class="fixedSize">
   <video src="./static/assets/pack_opening.mp4" class="absolute" autoplay></video>
   <div class="cardContainer fadeDisplay">
        <div><img src="http://51.210.104.99:8001/getImage/{drawCardPath}" ></div>

        <div class="flex justify-center">
            <div on:click={goToMenu} disabled={!drawCardController} class="buttonSave buttonDetail p-4 m-6">Valider</div>
        </div>
   </div>
</div>
{/if}

<style>
    .fixedSize {
        position: fixed;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }

    .cardContainer {
        position: absolute;
        transition: 2s all ease-in-out;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        justify-content: space-evenly;
    }

    img {
        transform: translateX(-1vw);
    }

    .fadeDisplay {
        opacity: 0;
    }
</style>