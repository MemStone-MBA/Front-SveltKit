<link rel='stylesheet' href='static/css/index.css'>


<script >
    import { io } from "$lib/realtime";
    import Loader from '../components/loader.svelte';
    import { user } from './auth'
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    var cardsTitle = "Cards "
    var cardsId =[]
    var cards = []
    var deck = []

    var IndexDeck = 0

    onMount(() => {

      if($user) {
        console.log($user)
        io.emit("cards", {jwt:$user.jwt})
        //io.emit("cards-user", {jwt:$user.jwt, userId:$user.id})
        io.on("cards", (res) => {
          if(res.status) {
            return
          }
          cardsTitle = "Cards (" + res.length + ")"
          cards = res
          console.log(cards)
        })


        // io.on("cards-user", (res) => {
        //   if(res.status) {
        //     return
        //   }
        //   cardsId = res
        //   console.log(res)
        // })
      }
    });


    function HandleAddCard(img){
      console.log(deck)
      document.querySelector("."+img.name).classList.add("disableElement")
      deck[IndexDeck] = img
      IndexDeck++
    }

    function HandleDeleteCard(img){
      for(var i=0;i<deck.length;i++){
        if(deck[i].id === img.id){
          deck.splice(i,1)
          console.log(document.querySelector("."+img.name))
          document.querySelector("."+img.name).classList.remove("disableElement")
          IndexDeck--
        }
      }
      deck = deck
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
              {#each deck as element}
              <div class="flex flex-row justify-between containercard my-2">
                <img src="http://51.210.104.99:8001/getImage/{element.path}" class="backgroundimage">
                <div class="deckcard ml-4">{element.name}</div>
                <div class="unselectcard px-4 py-2" on:dblclick={()=>{HandleDeleteCard(element)}}>X</div>
              </div>
                {/each}
            </div>
            <div class="flex justify-center">
                <div on:click={goToMenu} class="buttonSave buttonDetail p-4 m-6">Retour</div>
            </div>
       </div>

       <div class="colorbackfriend flex-1 flex flex-col">
            <div class="text-center titleCollection m-2">{ cardsTitle }</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll flex flex-wrap justify-center">
                
                
                {#each cards as img}
                    <div><img src="http://51.210.104.99:8001/getImage/{img.path}" class="p-2 {img.name}" on:dblclick={()=>{HandleAddCard(img)}}></div>
                {/each}

            </div>
            <div class="flex justify-center">
                <div class="buttonSave buttonDetail p-4 m-6">Sauvegarder</div>
            </div>
       </div>
    </div>
</div>