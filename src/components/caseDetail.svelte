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
	
	var openModale = false

	function showModale() {
		openModale = true
	}

	function hideModale() {
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

<div class="min-w-fit case flex-1 p-1 flex flex-col">
	<div class="price mt-2 mb-4">
		<div class="textprice">{baseCase.name} : {baseCase.count} caisses</div>
	</div>
	<img src='static/assets/icon_pack.svg' class="iconPack">
	<div class="buttonsContainer">
		<div on:click={() => openUserCases(baseCase)} class="ButtonRetour buttonDetail m4">
			Ouvrir
		</div>
		<div class="ButtonRetour buttonDetail m4">
			Infos
		</div>
	</div>
</div>