<script>

	import { user } from '../routes/auth.js';
	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';


	export let offerData;

	onMount(() => {

		offerData = offerData;

		console.log(offerData)

	})

	function buyUserCases(){


		io.emit("buyUserCase", {jwt:$user.jwt,userId:$user.id,offer:offerData}, ((res) => {

			if (Array.isArray(res)){
				res?.forEach(boxPurchased=>{
					if(boxPurchased.status != 200) {
						return
					}
				})

			}
			console.log(`${res.length} box purchased`)
		}))

	}

</script>


<div class="flex-1 p-4" on:click={ ()=>{ buyUserCases()}}>
	<img src='static/assets/icon_pack.svg' class='journeyPack'>
	<div class="price mt-2">
		<div class="flex flex-col">
			<div class="textprice">
				{offerData.description}
			</div>
			<div class="price">
				<div class="textprice">
					{offerData.Price}
				</div>
				<img src='static/assets/coin.svg' class='coin mt-1'>
			</div>
		</div>
	</div>
</div>