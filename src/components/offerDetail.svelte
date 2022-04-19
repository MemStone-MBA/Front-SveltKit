<script>

	import { user } from '../routes/auth.js';
	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import FriendPopup ,{  show , hide }  from "./friendPopup.svelte";
	import { popupAcceptWritable, popupDenyWritable, popupTextWritable } from '$lib/Popup.js';

	export let offerData;

	onMount(() => {

		offerData = offerData;

		console.log(offerData)

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

</script>


<div class="flex-1 p-4 max-w-sm cursor-pointer rounded-lg case" on:click={ ()=>{ buyUserCases()}}>
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
		</div>
	</div>
</div>