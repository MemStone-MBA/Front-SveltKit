<script>

	import { user } from '../routes/auth.js';
	import { io } from '$lib/realtime.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';


	export let offer

	onMount(() => {

		offer = {
			price:2000,
			description:'5 Starter Pack + 5 Starter Pack °2',
			cases:[{
				id:'62541db6d7dacb45b0928654',
				count:5,
			},{
				id:'6255710996241152307ed6f1',
				count:5,
			}]
		}


	})

	function buyUserCases(){


		io.emit("buyUserCase", {jwt:$user.jwt,userId:$user.id,offer:offer}, ((res) => {

			if (Array.isArray(res)){
				res?.forEach(boxPurchased=>{
					if(res.status != 200) {
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
				{offer.description}
			</div>
			<div class="price">
				<div class="textprice">
					{offer.price}
				</div>
				<img src='static/assets/coin.svg' class='coin mt-1'>
			</div>
		</div>
	</div>
</div>