<link rel='stylesheet' href='static/css/shop.css'>

<script>
import { goto } from "$app/navigation";
import { io } from "$lib/realtime";
import OfferDetail from "../components/offerDetail.svelte";
import { onMount } from "svelte";
import { isLog, user, userCasesWritable } from './auth';
import { onDestroy } from 'svelte/internal';
import FriendPopup ,{  show , hide }  from "../components/friendPopup.svelte";
import {popupTextWritable, popupCloseWritable }  from '../lib/Popup.js';


var CARDS_ID = []
var CARDS = []
var TIME_LEFT = ""
var COINS = 0

const price = {
    "commun": 1,
    "rare": 2,
    "epic": 3,
    "legendary": 4
}

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

onMount(() => {


    isLog((done) =>{

        COINS = $user.coins
        getStoreCards()
        getOffers()
        done();

    },_=>{

    })

})

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

function buyCard(card, price) {
    io.emit("buyUserCard", {jwt:$user.jwt,user: $user, idUser:$user.id,idCard:card.id, price: price}, ((res) => {
        if(res.error) {
            switch(res.error) {
                case "same":
                    show(true);
                    popupTextWritable.update(popup => popup= `You have already this card`)
                    popupCloseWritable.update(denyFunction => denyFunction = ()=>{
                        hide()
                    })
                    break;
                case "coins":
                    show(true);
                    popupTextWritable.update(popup => popup= `You dont have enough coins`)
                    popupCloseWritable.update(denyFunction => denyFunction = ()=>{
                        hide()
                    })
                    break;
                default:
                    show(true);
                    popupTextWritable.update(popup => popup= `Error while buying`)
                    popupCloseWritable.update(denyFunction => denyFunction = ()=>{
                        hide()
                    })
                    break
            }
            return
        }

        show(true);
        popupTextWritable.update(popup => popup= `Card buy !`)
        popupCloseWritable.update(denyFunction => denyFunction = ()=>{
            hide()
        })

        $user.coins = res.coins
        COINS = res.coins
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
                <div class="flex-1 cardBuy" on:click={() => { buyCard(card, price[card.rarety] * 500) }}>
                    <img alt="{card.path}" src="http://51.210.104.99:8001/getImage/{card.path}" class='journeyCard'>
                    <div class="price mt-2">
                        <div class="textprice">
                            {price[card.rarety] * 500}
                        </div>
                        <img src='static/assets/coin.svg' class='coin mt-1'>
                    </div>
                </div>
            {/each}
        </div>
        <div class="title_journeyPack">
            Packs
        </div>
        <div class="flex flex-row w-full justify-center p-8 mt-8 h-auto">

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