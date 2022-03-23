<link rel='stylesheet' href='static/css/index.css'>


<script >
    import { io } from "$lib/realtime";
    import Loader from '../components/loader.svelte';
    import { user } from './auth'
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    var cardsTitle = "Cards "

    var cards = []
    var deck;

    var cardsOwned = 0

    onMount(() => {
      bindCards()
    });

    function refreshCards(){
      cards = cards
    }

    function bindCards(){
      if($user) {
        io.emit("cards", {jwt:$user.jwt}, ((res) => {
          if(res.status) {
            return
          }
          cards = res
        }))

        io.emit("cards-user", {jwt:$user.jwt, userId:$user.id}, ((res) => {
          if(res.status) {
            return
          }

          let myCardsId = res.map(card => { return card.idCard})
          cards.filter(function(card) {
            if( myCardsId.includes(card.id)) {
              card.owned = true;
              cardsOwned ++
            }
            else
              card.owned = false;
          });
          refreshCards()
          bindDeck()
        }))
      }
    }

    function bindDeck() {
      if ($user) {

        io.emit("deck-user", { jwt: $user.jwt, userId: $user.id }, ((res) => {
          if (res.status) {
            return
          }

          deck = res[0] || [];
          //console.log(deck)
           let myDeckCardsId = deck?.listCards.map(card => { return card.id})
          cards.filter(function(card) {
            if (myDeckCardsId.includes(card.id)){
              card.inDeck = true;
              refreshCards()
              //console.log("indeck : ", card);
            }
            else{
              card.inDeck = false;
              refreshCards()
              //console.log("not in deck : ", card);
            }

          });
        }))
      }
    }

      function saveDeck() {

        let cardsSaved = []
        cards.map(card =>{

          if (card.owned && card.inDeck){
            cardsSaved.push(card)
          }
        });
        deck.listCards = cardsSaved
        console.table(deck.listCards)
        io.emit("deck-save", { jwt: $user.jwt, deck: deck }, ((res) => {
          if (res.status) {
            return
          }
          bindDeck()
        }))
      }

      function HandleAddCard(card) {
        card.inDeck = true;
        document.querySelector("." + card.name)?.classList.add("disableElement")
        refreshCards()
      }

      function HandleDeleteCard(card) {

        card.inDeck = false;
        document.querySelector("." + card.name)?.classList.remove("disableElement")
        refreshCards()
      }

      function goToMenu() {
        goto('/')
      }


</script>

<link rel='stylesheet' href='static/css/collection.css'>

<Loader></Loader>

<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-full flex flex-row ">
       <div class="colorbackfriend w-1/4 mr-10 flex flex-col">
            <div class="text-center titleCollection m-2">Deck</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll">

              {#each cards as card}
                {#if card.inDeck == true}
                  <div class="flex flex-row justify-between containercard my-2">
                    <img src="http://51.210.104.99:8001/getImage/{card.path}" class="backgroundimage">
                    <div class="deckcard ml-4">{card.name}</div>
                    <div class="unselectcard px-4 py-2" on:dblclick={()=>{HandleDeleteCard(card)}}>X</div>
                  </div>
                {/if}

                {/each}

            </div>
            <div class="flex justify-center">
                <div on:click={goToMenu} class="buttonSave buttonDetail p-4 m-6">Retour</div>
            </div>
       </div>

       <div class="colorbackfriend flex-1 flex flex-col">
            <div class="text-center titleCollection m-2">Cards ( {cardsOwned} / {cards.length} )</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll flex flex-wrap justify-center">
                
                
                {#each cards as card}
                  <div>
                  {#if card.owned == true}
                    {#if card.inDeck == true}
                      <img src="http://51.210.104.99:8001/getImage/{card.path}" class="p-2 {card.name} disableElement" on:dblclick={()=>{HandleDeleteCard(card)}}>
                    {:else}
                      <img src="http://51.210.104.99:8001/getImage/{card.path}" class="p-2 {card.name}" on:dblclick={()=>{HandleAddCard(card)}}>
                    {/if}
                  {:else}
                    <img src="http://51.210.104.99:8001/getImage/{card.path}" class="p-2 not-owned" on:dblclick={()=>{HandleAddCard(card)}}>

                  {/if}
                  </div>
                {/each}

            </div>
            <div class="flex justify-center">
                <div on:click={saveDeck} class="buttonSave buttonDetail p-4 m-6">Sauvegarder</div>
            </div>
       </div>
    </div>
</div>