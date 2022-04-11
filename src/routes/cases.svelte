<link rel='stylesheet' href='static/css/shop.css'>

<script>
import { goto } from "$app/navigation";
import { io } from "$lib/realtime";
import { onMount } from "svelte";
import { user } from './auth'

onMount(() => {
    if (user == null) {
        goto("/login");
    }
    COINS = $user.coins
    getStoreCards()
})

var CARDS_ID = []
var CARDS = []
var TIME_LEFT = ""
var COINS = 0

function getStoreCards(){
    io.emit("getUserCases", {jwt:$user.jwt}, ((res) => {
        if(res.status) {
            return
        }

    }))
}

function goToMenu() {
    goto('/')
}
</script>

<div class="backgroundsize colorbackmenu flex flex-col justify-between">
    <div>
        <div class="title_journeyCard mt-8">
            Vos packs
        </div>

        <div class="flex flex-row w-full mt-8 h-auto">

            <div class="flex-1 flex flex-col">
                <div class="price mt-2 mb-4">
                    <div class="textprice">Case nulle</div>
                </div>
                <img src='static/assets/icon_pack.svg' class="iconPack">
                <div class="price mt-2">
                    <div class="textprice">0</div>
                </div>
            </div>

        </div>


    </div>

    <div class="flex justify-center">
        <div on:click={goToMenu} class="ButtonRetour buttonDetail p-4 m-6">Retour</div>
    </div>
</div>