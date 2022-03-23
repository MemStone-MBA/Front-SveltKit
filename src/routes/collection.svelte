<link rel='stylesheet' href='static/css/index.css'>


<script >
    import { io } from "$lib/realtime";
    import Loader from '../components/loader.svelte';
    import { user } from './auth'
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import {
      CanvasTexture,
      Mesh,
      MeshBasicMaterial,
      OrthographicCamera,
      PerspectiveCamera,
      PlaneGeometry,
      Scene,
      WebGLRenderer,
      Group,
      Matrix4,
      Clock
    } from 'three';
    import { OrbitControls } from '@three-ts/orbit-controls';


    var cards = []
    var deck;

    var cardsOwned = 0

    onMount(() => {
      bindCards()

    });



    function ShowCard(card_url){
      console.log(card_url)
      var card_front = card_url ?? "./static/assets/card_front.png"
      var card_back = "./static/assets/card_back.png"


      var scene,
        camera,
        renderer,
        controls,
        frontcard,
        backcard;

      var options = {
        isanimate: true,
      };

// var gui = new dat.GUI();
// var isanim = gui.addFolder("Animate");
// isanim.add(options, "isanimate").name("Animate");
// isanim.open();

// gui.close()
      init()
      function init() {



        var container = document.getElementById("world");

        camera = new PerspectiveCamera(
          30,
          1301 / 2 / window.innerHeight,
          1,
          10000
        );
        camera.position.z = 100;

        scene = new Scene();
        renderer = new WebGLRenderer({ antialias: true, autoSize: true, alpha: true });

        renderer.setPixelRatio(2);
        renderer.setSize( window.innerHeight, window.innerHeight);

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
        controls.maxDistance = 150
        controls.minDistance = 70

        controls.update();
        document.getElementById("world").appendChild(renderer.domElement);

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
          scene.add(backcard);
        })
      }

      function mapImage(url, cb) {
        var img = new Image
        var canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d")

        img.crossorigin = "anonymous";
        img.src = url;

        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage( img, 0, 0 );

          var mat=new MeshBasicMaterial();
          mat.map = new CanvasTexture(canvas);

          cb(mat)
        }

      }
      var modelgroup = new Group();

      var matrix = new Matrix4();
      var period = 5;
      var clock = new Clock();

      function updateDraw(deltaTime) {
        //modelgroup.rotation.set(-camera.rotation._x, -camera.rotation._y, 0);
        /* if (options.isanimate) {
					 matrix.makeRotationY((clock.getDelta() * 0.7 * Math.PI) / period);
					 camera.position.applyMatrix4(matrix);
					 camera.lookAt(frontcard.position);
				 }*/
      }

      function animate(deltaTime) {
        requestAnimationFrame(animate);
        updateDraw(deltaTime);
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
      cards = cards
    }

    function bindCards(){
        checkUser(_=>{
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
      })
    }

    function bindDeck() {
      checkUser(_=>{
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
      })
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
<div style='' class=' overflow-hidden w-full h-full' id="world"></div>

<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-full flex flex-row ">
       <div class="colorbackfriend w-1/4 mr-10 flex flex-col">
            <div class="text-center titleCollection m-2">Deck</div>
            <div class="gray_bg_custom flex-1 overflow-y-scroll">

              {#each cards as card}
                {#if card.inDeck == true}
                  <div class="flex flex-row justify-between containercard my-2">
                    <img src="./static/assets/{card.path}" class="backgroundimage">
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
                      <img src="./static/assets/{card.path}" class="p-2 {card.name} disableElement" on:click={()=> ShowCard("./static/assets/"+card.path)} on:dblclick={()=>{HandleDeleteCard(card)}}>
                    {:else}
                      <img src="./static/assets/{card.path}" class="p-2 {card.name}" on:click={()=> ShowCard("./static/assets/"+card.path)} on:dblclick={()=>{HandleAddCard(card)}}>
                    {/if}
                  {:else}
                    <img src="./static/assets/{card.path}" class="p-2 not-owned"  on:dblclick={()=>{HandleAddCard(card)}}>

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