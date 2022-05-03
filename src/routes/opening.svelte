<link rel='stylesheet' href='static/css/index.css'>
<script>
    import Loader from '../components/loader.svelte';
    import { user, userCardObtained } from './auth';
    import { goto } from '$app/navigation';
    import { onDestroy, onMount } from 'svelte';
    import { io } from "$lib/realtime";
    import { CanvasTexture,  Mesh,  MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer, Group, Matrix4, Clock } from 'three';
    import { OrbitControls } from '@three-ts/orbit-controls';

    var CHEST = {}



    var drawCardController = true;
    var drawCardPath;

    //const DISPLAY_TIME = 0;
    const DISPLAY_TIME = 3500;
    const TOTAL_TIME = 60000;

    function ShowCard(card_url){
      document.querySelector("#world-container")?.classList.remove("hidden")
      var card_front = card_url ?? "./static/assets/card_front.png"
      var card_back = "./static/assets/card_back.png"

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
        let aspectY =  (window.innerHeight / 3)*2
        camera = new PerspectiveCamera(
          30,
          aspectX   /aspectY,
          1,
          10000
        );

        camera.position.z = 100;

        scene = new Scene();
        renderer = new WebGLRenderer({ antialias: true, alpha: true });

        renderer.setPixelRatio(2);
        renderer.setSize( aspectX,aspectY);

        controls = new OrbitControls(camera, renderer.domElement);

        controls.enabled = false;

        controls.enableDamping = false;
        controls.dampingFactor = 0.03;
        controls.autoRotate = true;

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

    // @ts-ignore
    controls.autoRotateSpeed = 75

    function animate(deltaTime) {
        requestAnimationFrame(animate);

        // decrease controls.autoRotateSpeed to 3
        if(controls.autoRotateSpeed > 3){
          controls.autoRotateSpeed -= 0.05
        }
        controls.update();
        renderer.render(scene, camera);
        
      }
      //window.addEventListener("load", init, false);
    }

    onMount(() => {

      let idCard;
      if ($userCardObtained == null)
        goto("/")

      idCard = $userCardObtained;
      userCardObtained.set(null);

      io.emit('getCardById', {jwt:$user.jwt, userId: $user.id, cardId: idCard}, ((res) => {
        drawCardPath = res.path
        drawCardController = false
        console.log(res.path)
        ShowCard("http://51.210.104.99:8001/getImage/"+res.path)
        dismissCard()
      }))


    })


    function goToMenu() {

        goto('/')
    }


    var toDisplay, toMenu;

    function dismissCard() {
        toDisplay = setTimeout(() => {
            document.querySelector('.cardContainer').classList.remove("fadeDisplay")
        }, DISPLAY_TIME);

        toMenu = setTimeout(() => {
            goToMenu()
        }, TOTAL_TIME);
    }

    onDestroy(() => {
        clearTimeout(toDisplay)
        clearTimeout(toMenu)
    })

</script>

<link rel='stylesheet' href='static/css/collection.css'>

<Loader wait={drawCardController}></Loader>

<!-- {#if !drawCardController} -->
<div class="fixedSize">
   <video src="./static/assets/pack_opening.mp4" class="absolute w-full h-full top-0 left-0 object-cover" autoplay></video>
   <div class="cardContainer fadeDisplay">
        <!-- <div><img src="http://51.210.104.99:8001/getImage/{drawCardPath}" ></div> -->
        <div id="fakeContainer"></div>
        <div id="world" ></div>

        <div class="flex justify-center">
            <div on:click={goToMenu} class="buttonSave buttonDetail p-4 m-6">Valider</div>
        </div>
   </div>
</div>
<!-- {/if} -->

<style>
    .fixedSize {
        position: fixed;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }

    .cardContainer {
        position: absolute;
        transition: 2s all ease-in-out;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        justify-content: space-evenly;
    }

    img {
        transform: translateX(-1vw);
    }

    .fadeDisplay {
        opacity: 0;
    }
</style>