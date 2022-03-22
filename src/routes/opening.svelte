<link rel='stylesheet' href='static/css/index.css'>
<script>
    import Loader from '../components/loader.svelte';
    import { user } from './auth'
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    function goToMenu() {
        goto('/')
    }

    onMount(() => {
        setTimeout(() => {
            console.log("here")
            document.querySelector('.cardContainer').classList.remove("fadeDisplay")
        }, 4500);

        setTimeout(() => {
            goToMenu()
        }, 60000);
    })

</script>

<link rel='stylesheet' href='static/css/collection.css'>

<Loader></Loader>

<div class="fixedSize">
   <video src="./static/assets/pack_opening.mp4" class="absolute" autoplay></video>
   <div class="cardContainer fadeDisplay">
        <div><img src="http://51.210.104.99:8001/getImage/Bigard.png"></div>

        <div class="flex justify-center">
            <div on:click={goToMenu} class="buttonSave buttonDetail p-4 m-6">Valider</div>
        </div>
   </div>
</div>

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