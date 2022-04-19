<script>

	import { io } from '$lib/realtime';
	import { user, userCardObtained, userCasesWritable } from '../routes/auth.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let baseCase;

	onMount(() => {

		baseCase = baseCase;


	})


	function openUserCases(baseCase){

		if (baseCase.count > 0){


			io.emit("openUserCase", {jwt:$user.jwt,userId:$user.id,cards:baseCase.cards, case:baseCase.userCases.shift()}, ((res,cardId) => {

				if(res.status != 200) {
					return
				}
				userCasesWritable.set(res);
				userCardObtained.set(cardId)
				goto("/opening")
			}))
		}


	}


</script>


<div class="min-w-fit case m-20 cursor-pointer flex-1 p-1 flex flex-col" on:click={openUserCases(baseCase)}>
	<div class="price mt-2 mb-4">
		<div class="textprice">{baseCase.name}</div>
	</div>
	<img src='static/assets/icon_pack.svg' class="iconPack">
	<div class="price mt-2">
		<div class="textprice">{baseCase.count}</div>
	</div>
</div>