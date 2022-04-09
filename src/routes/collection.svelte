<link rel='stylesheet' href='static/css/index.css'>


<script >
    import { io } from "$lib/realtime";
    import Loader from '../components/loader.svelte';
    import { user } from './auth'
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { CanvasTexture,  Mesh,  MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer, Group, Matrix4, Clock } from 'three';
    import { OrbitControls } from '@three-ts/orbit-controls';

    //All existing cards
    var cards = []
    //User Deck
    var deck;
    var cardsInDeck = 0;
    const MAX_CARDS = 5;

    //Cards showing
    var mouseClicked;
    var mouseCount=0;
    var cardShowed = false;

    //Title
    var cardsOwned = 0

    onMount(() => {
      bindCards()
      HideCard()
    });


    function HideCard(){
      let world = document.querySelector("#world")
      world.addEventListener('click', function( event ) {
        // @ts-ignore
        if (event.target.tagName != "CANVAS") {
          document.querySelector("#world-container")?.classList.add("hidden")
          cardShowed = false
        }
      });

    }

    function MouseDown(cardpath){
      mouseClicked = true;
      mouseCount++;
      let promise = new Promise((resolve , reject) => {
        let actualCount = mouseCount;
          setTimeout(function(){
            if (mouseClicked == true && cardShowed == false && actualCount == mouseCount)
              resolve();
            else
              reject()
          },1000)
      });
      promise.then(res => {ShowCard(cardpath)})
    }

    function MouseUp(){
      mouseClicked = false
    }

    function ShowCard(card_url){
      document.querySelector("#world-container")?.classList.remove("hidden")
      var card_front = card_url ?? "./static/assets/card_front.png"
      var card_back = "./static/assets/card_back.png"
      cardShowed = true;


      var scene,
        camera,
        renderer,
        controls,
        frontcard,
        backcard;

      init()
      function init() {



        var container = document.getElementById("world");
        container.innerHTML = ""
        let aspectX = (window.innerHeight / 5)*3
        let aspectY =  (window.innerHeight / 3) *3
        camera = new PerspectiveCamera(
          30,
          aspectX   /aspectY,
          1,
          10000
        );

        camera.position.z = 100;

        scene = new Scene();
        // @ts-ignore
        renderer = new WebGLRenderer({ antialias: true, autoSize: true, alpha: true });

        renderer.setPixelRatio(2);
        renderer.setSize( aspectX,aspectY);

        controls = new OrbitControls(camera, renderer.domElement);


        controls.rotateSpeed = 0.1;
        controls.enabled = true
        controls.enableKeys=false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.03;


        let rad = 1;
        controls.minPolarAngle = 0 + rad ; // radians
        controls.maxPolarAngle = Math.PI - rad; // radians

        controls.minAzimuthAngle = - Infinity; // radians
        controls.maxAzimuthAngle = Infinity;

        controls.enableZoom = true;
        controls.maxDistance = 90
        controls.minDistance = 70

        controls.update();
        container.appendChild(renderer.domElement);

        cardFront();
        cardBack();

        animate();
      }

      function cardFront() {
        var geometry = new PlaneGeometry(20, 30);

        mapImage(card_front, (material) => {
          frontcard = new Mesh(geometry, material);
          scene.add(frontcard);
        })
      }

      function cardBack() {
        var geometry = new PlaneGeometry(20, 30);

        mapImage(card_back, (material) => {
          backcard = new Mesh(geometry, material);
          backcard.rotation.set(0, Math.PI, 0);
          backcard.position.set(0,0,0)
          scene.add(backcard);
        })
      }

      function mapImage(url, cb) {
        var img = new Image
        var canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d")

        img.crossOrigin = "anonymous";
        img.src = url;
        img.alt = "Rotating card"

        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage( img, 0, 0 );

          var mat=new MeshBasicMaterial();
          mat.transparent = true;
          mat.opacity = 1
          mat.map = new CanvasTexture(canvas);

          cb(mat)
        }

      }

      function animate(deltaTime) {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }

      window.addEventListener("load", init, false);
    }



    function checkUser(callback){
     
      if($user != null && typeof $user === 'object' ){
        if (callback != null && typeof callback === "function"){
          callback()
        }else{
          console.error("Missing callback function")
        }
      }else{
        console.error("Missing User")
      }
    }


    function refreshCards(){
      cards = cards;
      cardsInDeck = cards.filter((card) => card.inDeck == true).length;
    }

    function bindCards(){
        checkUser(_=>{
        io.emit("cards", {jwt:$user.jwt}, ((res) => {
          if(res.status) {
            return
          }
          cards = res

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
        }))


      })
    }

    function bindDeck() {
      checkUser(_=>{
        io.emit("deck-user", { jwt: $user.jwt, userId: $user.id }, ((res) => {
          if (res.status) {
            return
          }

          deck = res[0] || [];
          if( deck?.listCards != null && deck?.listCards.length > 0 ){
            let myDeckCardsId = deck?.listCards?.map(card => { return card.id})
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
          }

          
        }))
      })
    }

      function saveDeck() {

        if(cardsInDeck!=MAX_CARDS) {
          return
        }

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
        if(cardsInDeck < MAX_CARDS) {
          card.inDeck = true;
          document.querySelector("." + naturalize(card.name))?.classList.add("disableElement")
          refreshCards()
        }
      }

      function HandleDeleteCard(card) {

        card.inDeck = false;
        document.querySelector("." + naturalize(card.name))?.classList.remove("disableElement")
        refreshCards()
      }

      function goToMenu() {
        goto('/')
      }

      function naturalize(str) {
        return str.trim().split(" ").join("_")
      }


</script>





<link rel='stylesheet' href='static/css/collection.css'>

<Loader></Loader>
<div id="world-container" class='world-container hidden w-full h-full' >
  <div id="world-bg" class=' w-full h-full'  ></div>
  <div  class='w-full h-full' id="world" ></div>
</div>


<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-full flex flex-row ">
       <div class="fixedBack colorbackfriend w-1/4 mr-10 flex flex-col">
            <div class="text-center titleCollection m-2">Deck ({cardsInDeck} / {MAX_CARDS})</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll">

              {#each cards as card}
                {#if card.inDeck == true}
                  <div class="flex flex-row justify-between containercard my-2">
                    <img alt="{card.path}" src="http://51.210.104.99:8001/getImage/{card.path}" class="backgroundimage">
                    <div class="deckcard ml-4">{card.name}</div>
                    <div class="unselectcard px-4 py-2" on:click={()=>{HandleDeleteCard(card)}}>X</div>
                  </div>
                {/if}

                {/each}

            </div>
            <div class="flex justify-center">
                <div on:click={goToMenu} class="buttonSave buttonDetail p-4 m-6">Retour</div>
            </div>
       </div>

       <div class="fixedBack colorbackfriend flex-1 flex flex-col">
            <div class="text-center titleCollection m-2">Cards ( {cardsOwned} / {cards.length} )</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll flex flex-wrap justify-center">
                
                
                {#each cards as card}
                  <div>
                  {#if card.owned == true}
                    {#if card.inDeck == true}
                      <img alt="{card.path}" src="http://51.210.104.99:8001/getImage/{card.path}" class="p-2 { naturalize(card.name) } disableElement" on:mouseup={()=> MouseUp()} on:mousedown={()=> MouseDown("http://51.210.104.99:8001/getImage/"+card.path)} on:click={()=>{HandleDeleteCard(card)}}>
                    {:else}
                      <img alt="{card.path}" src="http://51.210.104.99:8001/getImage/{card.path}" class="p-2 { naturalize(card.name) }" on:mouseup={()=> MouseUp()} on:mousedown={()=> MouseDown("http://51.210.104.99:8001/getImage/"+card.path)} on:click={()=>{HandleAddCard(card)}}>
                    {/if}
                  {:else}
                    <img alt="{card.path}" src="http://51.210.104.99:8001/getImage/{card.path}" class="p-2 not-owned" >

                  {/if}
                  </div>
                {/each}

            </div>
            <div class="flex justify-center">
                <div on:click={saveDeck} disabled={Boolean(cardsInDeck!=MAX_CARDS)} class="buttonSave buttonDetail p-4 m-6">Sauvegarder</div>
            </div>
       </div>
    </div>
</div>