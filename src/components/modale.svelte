<script>

	import { user } from '../routes/auth.js';
	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

    export let openModale;
	//export let showModale;
    export let hideModale;
    export let offer;

    var cases = []

    onMount(() => {
        offer.cases.forEach(caseOffer => {
            let object = {
                count: caseOffer.count
            }
            io.emit('getCaseById', {jwt: $user.jwt, caseId: caseOffer.id}, ((caseDetail) => {
                object.name = caseDetail.name
                object.cards = []
                object.total = 0
                for (const [key, value] of Object.entries(caseDetail.cards)) {
                    io.emit('getCardById', {jwt: $user.jwt, cardId: key}, ((cardDetail) => {
                        cardDetail.dropRate = value
                        object.total += parseInt(value)
                        object.cards.push(cardDetail)
                    }))
                }
            }))
            cases.push(object)
        });
    })

    function stopPropagation(event) {
        event.stopPropagation();
    }

</script>

<style>
    .bgModale {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999;
    }

    .caseOfferContainer {
        background-color: var(--color-darkgraymenu);;
        width: 80%;
        height: 80%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        border-radius: 10px;
        padding: 20px;
        overflow-y: scroll;
        border: 5px solid rgb(102, 102, 102);
    }

    .caseOffer {
        margin-top: 20px;
    }

    .caseOfferCardsContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .caseOfferCard {
        margin-left: 20px;
    }

    .caseOfferCard img{
        height: 20vh;
        width: auto;
    }

    .offerTitle {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #E7C318;;
    }

    .dropRate {
        color: white;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
    }

    .close {
        position: absolute; 
        top: 10px; 
        right: 10px;
        cursor: pointer;
        height: 40px;
        width: 40px;
    }

    .close svg {
        height: 100%;
        width: 100%;
    }
</style>

{#if openModale == true}
<div class="bgModale" on:click={hideModale}>
    <div class="caseOfferContainer" on:click={stopPropagation}>
        <div class="close" on:click={hideModale}>
            <svg class="w-6 h-6" fill="none" stroke="#E7C318" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        {#each cases as caseOffer}
            <div class="caseOffer">
                <h3 class="offerTitle">Caisse {caseOffer.name} (x{caseOffer.count})</h3>
                <div class="caseOfferCardsContainer">
                    {#each caseOffer.cards as card}
                        <div class="caseOfferCard">
                            <img src="http://51.210.104.99:8001/getImage/{card.path}" />
                            <div class="dropRate">{Math.round(card.dropRate * 100 / caseOffer.total)}%</div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}   
    </div>
</div>
{/if}