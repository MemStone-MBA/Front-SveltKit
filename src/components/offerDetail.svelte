<script>

	import { user } from '../routes/auth.js';
	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import FriendPopup ,{  show , hide }  from "./friendPopup.svelte";
	import { popupAcceptWritable, popupDenyWritable, popupTextWritable, popupCloseWritable } from '$lib/Popup.js';
	import Modale from "./modale.svelte";
	import { onDestroy } from 'svelte/internal';

	export let offerData;

	var openModale = false

	onMount(() => {
		offerData = offerData;
	})

	function buyUserCases(price){

		if($user.coins < price){
			show(true);
			popupTextWritable.update(popup => popup= `You don't have enough coins`)
			popupCloseWritable.update(denyFunction => denyFunction = ()=>{
				hide()
			})
			return
		}

		show();
		popupTextWritable.update(popup => popup= `confirm your purchase of ${offerData.description}`)
		popupAcceptWritable.update(acceptFunction => acceptFunction = ()=>{
			console.log("accept")
			io.emit("buyCoins", {user:$user, amount: price * -1}, ((res) => {
				if(res.status) {
					return
				}

				console.log(res)

				$user.coins = res.coins

				console.log($user)

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
			}))
		})

		popupDenyWritable.update(denyFunction => denyFunction = ()=>{
				hide();
		})
	}
	onDestroy(()=>{
		popupAcceptWritable.subscribe(value => { })
		popupDenyWritable.subscribe(value => { })
		popupTextWritable.subscribe(value => { })
	})

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
				<div on:click={ ()=>{ buyUserCases(offerData.Price)}} class="ButtonRetour buttonDetail m4">
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
