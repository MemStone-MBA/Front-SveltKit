

<script >

	import { onMount } from 'svelte'
	import {Scene, Matrix4,Clock ,WebGLRenderer , OrthographicCamera, PlaneGeometry,Mesh,MeshBasicMaterial,CanvasTexture} from 'three'
	// npm uninstall @three-ts/orbit-controls
	import { OrbitControls} from '@three-ts/orbit-controls'

	onMount(async () => {

		var backCard;
		var frontCard;

		var card_front = "./static/assets/card_front.png"
		var card_back = "./static/assets/card_back.png"

		var camera, controls, scene, renderer;
		var frustumSize = 1000;
		init();
		render();
		animate();

		function init() {
			scene = new Scene();

			renderer = new WebGLRenderer({ antialias: true, autoSize: true, alpha: true });

			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );

			var container = document.getElementById( 'world' );
			container.appendChild( renderer.domElement );

			var aspect = window.innerWidth / window.innerHeight;
			camera = new OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
			camera.position.z = 400;
			camera.setViewOffset(1000,1000,200,200,600,600)
			controls = new OrbitControls( camera, renderer.domElement );
			controls.autoRotate = true
			controls.noZoom = true
			var geometry = new PlaneGeometry( 200, 300 );

			let x = 0;
			let y = 0;
			let z = 30;


			mapImage(card_front, (material) => {

				frontCard = new Mesh(geometry, material);

				frontCard.position.x = x;
				frontCard.position.y = y;
				frontCard.position.z = z;
				frontCard.updateMatrix();
				frontCard.matrixAutoUpdate = false;
				scene.add( frontCard );
			})





			mapImage(card_back, (material) => {

				backCard = new Mesh(geometry, material);
				backCard.rotation.set(0, Math.PI, 0);
				//scene.add(mesh);
				backCard.position.x = x;
				backCard.position.y = y;
				backCard.position.z = z //- 5;
				backCard.updateMatrix();
				backCard.matrixAutoUpdate = false;
				scene.add( backCard );
			})


			window.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}





		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			render();
		}

		function render() {
			renderer.render( scene, camera );
		}

		function mapImage(url, cb) {
			var img = new Image()
			var canvas = document.createElement("canvas"),
				ctx = canvas.getContext("2d")

			img.crossOrigin = "Anonymous";

			img.onload = function() {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage( img, 0, 0 );

				var mat=new MeshBasicMaterial();
				mat.map = new CanvasTexture(canvas);

				cb(mat)
			}
			img.src = url;
		}





	})


</script>




		<div class='header-landing w-full leading-10 flex'>
			<div class='w-1/4 p-4 '>
				<a href='/'><img src='static/assets/memstone_logo.png' class='img-contain'></a>

			</div>
			<div class=' w-full flex justify-end items-center pr-8'>
				<div class='uppercase p-4 text-white cursor-pointer'>
					Actualités
				</div>
				<div class='uppercase p-4 pr-16 pl-16 text-white cursor-pointer'>
					Mon Compte
				</div>
				<div class='title-btn uppercase pr-16 pl-16 p-1 text-black bg-amber-300 cursor-pointer'>
					Jouer
				</div>
			</div >
		</div>

	<div class='content-landing flex justify-center items-center w-full'>
		<div class='content-landing-left grow-[2] w-3/5 h-full flex justify-center items-center'>
			<div class='p-8'>
				<h1 class='uppercase text-white '>
					Memstone
				</h1>
				<h2 class='uppercase text-white '>
					Un Aventure Mem-Orable
				</h2>
			</div>

		</div>
		<div class='content-landing-right grow-1 w-2/5 h-full flex justify-center bg-white items-center'>
			<h3 class='uppercase p-4 cursor-pointer'>
				Découvrir
			</h3>
		</div>
	</div>
 <div class='clear w-full h-16 bg-black'>

 </div>

	<div class='content-landing flex justify-center items-center w-full'>
		<div class='content-landing-left grow-1 w-2/5 h-full flex justify-center bg-gradient items-center overflow-hidden'>
			<div class='p-8 '>

				<div style='' class=' overflow-hidden w-full h-full' id="world"></div>


			</div>

		</div>
		<div class='content-landing-right grow-[2]  w-3/5  h-full flex justify-center text-right bg-black items-center'>

			<div class='paragraph p-8'>
				<h3 class='uppercase  text-white'>
					1 VS 1
				</h3>
				<p class='uppercase  text-white'>
					Des combats 1 contre 1 sans limites
				</p>
			</div>


		</div>
	</div>
<div class='clear w-full h-16 bg-black'>

</div>

<div class='content-landing flex justify-center items-center w-full'>
	<div class='content-landing-left grow-[2]  w-3/5  h-full flex justify-center  bg-black items-center overflow-hidden'>
		<div class='p-8 '>

			<div class='paragraph p-8'>
				<h3 class='uppercase  text-white'>
					Jouez
				</h3>
				<p class='uppercase  text-white'>
					N'importe où, PC, Android, Ios
				</p>
			</div>


		</div>

	</div>
	<div class='content-landing-right relative overflow-hidden  grow-1 w-2/5 h-full flex justify-center bg-gradient text-right  items-center'>

		<div class='p-4 w-2/3 w-full z-10 '>
			<img class='img-contain' src='static/assets/mokeupCard.png'>

		</div>
		<div class='scale-75 origin-bottom-right p-4 w-2/3 w-full transition-all -translate-x-8 translate-y-4 absolute rotate-[30deg] hover:rotate-[40deg]  z-20'>
			<img class='img-contain' src='static/assets/mokeupTitle.png'>

		</div>

	</div>
</div>
<div class='clear w-full h-16 bg-black'>

</div>
<div class='content-landing flex justify-center text-center bg-black items-center w-full flex-col'>

	<div class='paragraph p-8'>
		<h3 class='uppercase  text-white'>
			N'ATTENDEZ PLUS
		</h3>
	</div>
	<div class='paragraph p-8'>

	<a href='/'>
		<div class='title-btn bottom-btn uppercase pr-16 pl-16 p-8 text-black bg-amber-300 cursor-pointer'>
			Jouer
		</div>
	</a>
	</div>


</div>


	<style>

		.bottom-btn{
        font-family: barlow-eb;
        font-size: 5vw;
		}

      .paragraph h3{
          font-size: 9vw;
          line-height: 0.9;
          font-family: barlow-eb;
      }
      .paragraph p{
          font-family: barlow-sb;
          line-height: 0.9;
          font-size: 5vw;
      }


			.title-btn{
					background: var(--color-subtitle);
			}

		.header-landing{
				background: var(--color-head);
				font-family: barlow-sb;
		}
		.clear{
        background: var(--color-head);
		}

		h1{
				font-family: barlow-eb;
				font-size: 9vw;
        line-height: 0.9;
		}
      h2{
          font-family: barlow-sb;
          font-size: 5vw;
          line-height: 0.9;
      }

      h3{
          font-family: barlow-eb;
          font-size: 6vw;
          line-height: 0.9;
					color: var(--color-subtitle);
      }

		.content-landing{
				background: var(--color-background);
				height: 35rem;
		}


	</style>