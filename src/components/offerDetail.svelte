<script>

	import { user } from '../routes/auth.js';
	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import FriendPopup ,{  show , hide }  from "./friendPopup.svelte";
	import { popupAcceptWritable, popupDenyWritable, popupTextWritable } from '$lib/Popup.js';
	import Modale from "./modale.svelte";

	export let offerData;

	var openModale = false

	onMount(() => {
		offerData = offerData;
	})

	function buyUserCases(){

		show();
		popupTextWritable.update(popup => popup= `confirm your purchase of ${offerData.description}`)
		popupAcceptWritable.update(acceptFunction => acceptFunction = ()=>{
			io.emit("buyUserCase", {jwt:$user.jwt,userId:$user.id,offer:offerData}, ((res) => {

				if (Array.isArray(res)){
					res?.forEach(boxPurchased=>{
						if(boxPurchased.status != 200) {
							return
						}
					})

				}
				hide();
				console.log(`${res.length} box purchased`)
			}))

		})

		popupDenyWritable.update(denyFunction => denyFunction = ()=>{
				hide();
		})
	}

	function showModale() {
		openModale = true
	}

	function hideModale(e) {
		openModale = false
	}

</script>

<style>
	.buttonsContainer {
		display: flex;
		flex-direction: row;
	}

	.buttonsContainer div {
		font-size: 22px;
		margin: 10px;
		height: auto;
		padding: 5px
	}
</style>

<div class="flex-1 p-4 max-w-sm rounded-lg case">
	<img src='static/assets/icon_pack.svg' class='journeyPack'>
	<div class="price mt-2">
		<div class="flex flex-col">
			<div class="textDesc ">
				{offerData.description}
			</div>
			<div class="price">
				<div class="textprice ">
					{offerData.Price}
				</div>
				<img src='static/assets/coin.svg' class='coin mt-1'>
			</div>
			<div class="buttonsContainer">
				<div on:click={ ()=>{ buyUserCases()}} class="ButtonRetour buttonDetail m4">
					Acheter
				</div>
				<div on:click={showModale} class="ButtonRetour buttonDetail m4">
					Infos
				</div>
			</div>
		</div>
	</div>

	<Modale
		openModale={openModale}
		hideModale={hideModale}
		offer={offerData}
	></Modale>
</div>
