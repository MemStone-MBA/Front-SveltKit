
<script lang="ts">
	import { io } from "$lib/realtime";
	import { onMount } from "svelte";
	import { user } from './auth.js'
	import { goto } from '$app/navigation';
	import {ConnexionStatus } from '$lib/Status';
	import { connexionStatusWritable, loaderStatusWritable } from './auth.js';

	var username = ""
	var mail = ""
	var password = ""

	var bad_credentials = false;

	let oldValue
	var bad_credentials = false;
	var credentialsMessage = "";

	onMount(() => {

		/**
		 * Server response for login
		*/
		connexionStatusWritable.subscribe(value => {
			oldValue = value
			showErrors(value)
		})

		/**
		 * Server response for login
		*/
		io.on("register-res", res => {

			if(res.status == undefined){
				connexionStatusWritable.update(value => value = ConnexionStatus.Error)
			}else {
				connexionStatusWritable.update(value => value = res.status)
			}

			if (res.status == ConnexionStatus.Connected){
				$user =  res.response;
				if(res == null) {
					bad_credentials = true
					resetInput()
				} else {
					localStorage.setItem('username', mail)
					localStorage.setItem('password', password)
					localStorage.setItem('jwt', $user.jwt)
					bad_credentials = false
					resetInput()
					goto("/")
				}
			}
		})

		function setLoader(loaderVal){
		loaderStatusWritable.update(value =>  value = loaderVal)
	}

	function showErrors (value){
		console.log("value : ",value)

		credentialsMessage = value;
		switch (value){
			case ConnexionStatus.ErrorIds:
				bad_credentials = true;
				setLoader(false)
				break;
			case ConnexionStatus.Replace:
				bad_credentials = true;
				setLoader(false)
				break;
			case ConnexionStatus.Connected:
				bad_credentials = false;
				break;
			case ConnexionStatus.Connecting:

				bad_credentials = false;
				break;
			default:
				setLoader(false)
				bad_credentials = false;
				break;
		}
	}
	})

	/**
	 * Can be username or mail
	 */
	function Register() {
		io.emit("register", {username, mail, password})
	}

	function Logout() {
		$user = null
	}

	function resetInput() {
		username = ""
		mail = ""
		password = ""
	}

</script>

<link rel='stylesheet' href='static/css/login.css'>

<div class="back">
    <div class='content-center w-1/3 mx-auto pt-12'>
        <img src='static/assets/memstone_logo.png' class='img-contain'>
    </div>

	{#if $user != null}
		<div>
			<h1>Vous êtes déja connecté</h1>
			<button on:click={Logout}>Se deconnecter</button>
		</div>
	{:else}
		<div class="w-1/3 m-auto mb-20">
			<input class="loginform" type="text" placeholder="Username" bind:value={username}>
			<input class="loginform" type="text" placeholder="Mail" bind:value={mail}>
			<input class="loginform" type="password" placeholder="Password" bind:value={password}>
			<div class="play" on:click={Register}>S'enregistrer</div>

			<a href="/login" class="flex justify-center mt-5 text-white text-center w-full">Se connecter</a>

			{#if bad_credentials == true}
				<p class="mt-5 text-rose-600 text-center">Email déja utilisée ou incorrect / Mot de passe incorrect</p>
			{/if}
		</div>
	{/if}
</div>