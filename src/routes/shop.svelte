<link rel='stylesheet' href='static/css/shop.css'>

<script>
import { goto } from "$app/navigation";
import { io } from "$lib/realtime";
import OfferDetail from "../components/offerDetail.svelte";
import { onMount } from "svelte";
import { user, userCasesWritable } from './auth';

onMount(() => {
    if (user == null) {
        goto("/login");
    }
    COINS = $user.coins
    getStoreCards()
    getOffers()

})

var CARDS_ID = []
var CARDS = []
var TIME_LEFT = ""
var COINS = 0

var BUY_OPTIONS = [
    {
        coins: 1200,
        price: 9.99
    },
    {
        coins: 4000,
        price: 29.99
    },
    {
        coins: 15000,
        price: 99.99
    }
]

let offers = []


function getStoreCards(){
    io.emit("todayCard", {jwt:$user.jwt}, ((res) => {
        if(res.status) {
            return
        }

        var now = new Date()
        var diff = res.ts - now.getTime()
        var hours = Math.floor(diff / (1000 * 60 * 60))
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        var time = hours + "h " + minutes + "m restantes"        

        TIME_LEFT = time
        CARDS = res.cards
    }))
}


function getOffers(){
    io.emit("getOffers", {jwt:$user.jwt}, ((res) => {
      

       if(res.status != 200)
        return;


        offers = res?.offers;

        console.log(offers);

    }))
}




function buyCoins(amount){
    io.emit("buyCoins", {user:$user, amount:amount}, ((res) => {
        if(res.status) {
            return
        }

        $user.coins = res.coins
        COINS = res.coins
    }))
}

function goToMenu() {
    goto('/')
}

function buyUserCases(id){

    let offre = {
        price:1000,
        caseId:id,
        number:4
    }

        io.emit("buyUserCase", {jwt:$user.jwt,userId:$user.id,caseId:offre.caseId}, ((res) => {

            if (Array.isArray(res)){
                res?.forEach(boxPurchased=>{
                    if(boxPurchased.status != 200) {
                        return
                    }
                })

            }
            console.log(`${res.length} box purchased`)
        }))

}

</script>

<div class="backgroundsize colorbackmenu flex flex-row">
    <div class="main_container">
        <div class="title_journeyCard mt-8">
            Carte à la une {TIME_LEFT}
        </div>
        <div class="flex flex-row w-full pb-20 mt-8 h-auto">

            {#each CARDS as card}
                <div class="flex-1">
                    <img alt="{card.path}" src="http://51.210.104.99:8001/getImage/{card.path}" class='journeyCard'>
                    <div class="price mt-2">
                        <div class="textprice">
                            200
                        </div>
                        <img src='static/assets/coin.svg' class='coin mt-1'>
                    </div>
                </div>
            {/each}
        </div>
        <div class="title_journeyPack">
            Packs
        </div>
        <div class="flex flex-row w-full  mt-8 h-auto">

            {#each offers as offer}
                <OfferDetail bind:offerData={offer} ></OfferDetail>
            {/each}
            
        </div>
    </div>
    <div class="flex-1 p-4 flex flex-col justify-between">
        <div class="flex-1 p-4 flex-col">
            <div class="playerMoney flex flex-row">
                {COINS}
                <img src='static/assets/coin.svg' class='Pcoin ml-4 mr-4'>
            </div>

            {#each BUY_OPTIONS as option}
                <div class="flex flex-col mb-4 bottom-0 buttonDetail" on:click={() => buyCoins(option.coins)}>
                    <div class="ourMoney flex flex-row  w-full">
                        {option.coins}
                        <img src='static/assets/coin.svg' class='coin mt-1'>
        
                    </div>
                    <div class="flex-1 euroMoney flex flex-row w-full">
                        {option.price}€
                    </div>
                </div>
            {/each}
        </div>
        <div class="mx-4">
            <div on:click={goToMenu} class="ButtonRetour buttonDetail">
                Retour
            </div>
        </div>
    </div>
</div>