<link rel='stylesheet' href='static/css/shop.css'>

<script>
import { goto } from "$app/navigation";
import { io } from "$lib/realtime";
import { onMount } from "svelte";
import { user, userCasesWritable } from './auth';

onMount(() => {
    if (user == null) {
        goto("/login");
    }
    COINS = $user.coins
    userCasesWritable.subscribe(data => console.log(data))
    getUserCases();




})

function getUserCases(){
    io.emit("getUserCases", {jwt:$user.jwt,userId:$user.id}, ((res) => {
        if(res.status != 200) {
            return
        }
        userCasesWritable.set(res);

    }))
}

function openUserCases(baseCase){

    if (baseCase.count > 0){


        io.emit("openUserCase", {jwt:$user.jwt,userId:$user.id,cards:baseCase.cards, case:baseCase.userCases.shift()}, ((res,cardId) => {

            if(res.status != 200) {
                return
            }
            userCasesWritable.set(res);
            console.log(cardId)

        }))
    }


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

            {#each $userCasesWritable.cases as baseCase}



                <div class="min-w-fit flex-1 p-1 flex flex-col" on:click={openUserCases(baseCase)}>
                    <div class="price mt-2 mb-4">
                        <div class="textprice">{baseCase.name}</div>
                    </div>
                    <img src='static/assets/icon_pack.svg' class="iconPack">
                    <div class="price mt-2">
                        <div class="textprice">{baseCase.count}</div>
                    </div>
                </div>

            {/each}





        </div>


    </div>

    <div class="flex justify-center">
        <div on:click={goToMenu} class="ButtonRetour buttonDetail p-4 m-6">Retour</div>
    </div>
</div>