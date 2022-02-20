
<script lang="ts">
	import { io } from "$lib/realtime";
	import { onMount } from "svelte";
	import { user } from './auth.js'
	import { goto } from '$app/navigation';

	var mail = ""
	var password = ""

	var bad_credentials = false;

	onMount(() => {

		let saveUsername = localStorage.getItem('username')
		let savePassword = localStorage.getItem('password')
		
		if(savePassword && saveUsername) {
			mail = saveUsername
			password = savePassword

			Login()
		}

		/**
		 * Server response for login
		*/
		io.on("login-res", (res) => {
			$user = res;
			if(res == null) {
				bad_credentials = true
				resetInput()
			} else {
				localStorage.setItem('username', mail)
				localStorage.setItem('password', password)

				bad_credentials = false
				resetInput()

				goto("/")
			}
		})
	})

	/**
	 * Can be username or mail
	 */
	function Login() {
		io.emit("login", {mail,password})
	}

	function Logout() {
		$user = null
	}

	function resetInput() {
		mail = ""
		password = ""
	}

</script>

<link rel='stylesheet' href='static/css/login.css'>

<div class="back">
    <div class='content-center w-1/3 mx-auto pt-12'>
        <img src='static/assets/memstone_logo.png' class='img-contain'>
    </div>

	<div class="w-1/3 m-auto mb-20">
		<input class="loginform" type="text" placeholder="Mail" bind:value={mail}>
		<input class="loginform" type="password" placeholder="Password" bind:value={password}>
		<div class="play" on:click={Login}>Se connecter</div>

		<a href="/register" class="flex justify-center mt-5 text-white text-center w-full">Créer un compte</a>

		{#if bad_credentials == true}
			<p class="mt-5 text-rose-600 text-center">Identifiant ou mot de passe incorrect</p>
		{/if}
	</div>
</div>