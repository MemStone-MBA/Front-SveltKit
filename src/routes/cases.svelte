<link rel='stylesheet' href='static/css/shop.css'>

<script>
import { goto } from "$app/navigation";
import { io } from "$lib/realtime";
import { onMount } from "svelte";
import { user, userCardObtained, userCasesWritable } from './auth';
import { onDestroy } from 'svelte/internal';
import  CaseDetail  from '../components/caseDetail.svelte';

onMount(() => {
    if (user == null) {
        goto("/login");
    }
    COINS = $user.coins

    getUserCases();



})

onDestroy(userCasesWritable.subscribe(data => console.log(data)));

function getUserCases(){
    io.emit("getUserCases", {jwt:$user.jwt,userId:$user.id}, ((res) => {
        if(res.status != 200) {
            return
        }
        userCasesWritable.set(res);

    }))
}

var CARDS_ID = []
var CARDS = []
var TIME_LEFT = ""
var COINS = 0




function goToMenu() {
    goto('/')
}
</script>

<div class="backgroundsize colorbackmenu flex flex-col justify-between">
    <div>
        <div class="title_journeyCard mt-8">
            Vos packs
        </div>

        <div class="flex flex-row flex-wrap w-full mt-8 h-auto">

            {#each $userCasesWritable.cases as caseData}

                <CaseDetail bind:baseCase={caseData}></CaseDetail>



            {/each}





        </div>


    </div>

    <div class="flex justify-center">
        <div on:click={goToMenu} class="ButtonRetour buttonDetail p-4 m-6">Retour</div>
    </div>
</div>