<link rel='stylesheet' href='static/css/shop.css'>

<script>
import { goto } from "$app/navigation";
import { io } from "$lib/realtime";
import { onMount } from "svelte";
import { isLog, user, userCardObtained, userCasesWritable } from './auth';
import { onDestroy } from 'svelte/internal';
import  CaseDetail  from '../components/caseDetail.svelte';

onMount(() => {

    isLog((done) =>{
        COINS = $user.coins

        getUserCases();

        done();

    },_=>{

    })


})

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

<style>
    .casesContainer {
        margin-bottom: 25vh;
    }
</style>

<div class="backgroundsize colorbackmenu flex flex-col justify-between">
    <div>
        <div class="title_journeyCard mt-8">
            Vos packs
        </div>

        <div class="casesContainer flex flex-row flex-wrap w-full h-auto">
            {#each $userCasesWritable.cases as caseData}
                <CaseDetail bind:baseCase={caseData}></CaseDetail>
            {/each}
        </div>


    </div>

    <div class="flex justify-center caseBack">
        <div on:click={goToMenu} class="ButtonRetour buttonDetail p-4 m-6">Retour</div>
    </div>
</div>