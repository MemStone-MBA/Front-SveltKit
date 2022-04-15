
<script lang="ts">
	import { io } from "$lib/realtime";
	import { onMount } from "svelte";
	import { user } from './auth.js'
	import { goto } from '$app/navigation';
import {ConnexionStatus } from '$lib/Status';
	import { connexionStatusWritable, loaderStatusWritable } from './auth.js';


	var mail = ""
	var password = ""
	let oldValue
	var bad_credentials = false;
	var credentialsMessage = "";
	onMount(() => {



		mail = localStorage.getItem('username') ? localStorage.getItem('username') : "";
		password = localStorage.getItem('password') ? localStorage.getItem('password') : "";

		mail = 'admin'
		password = 'admin1234'
	/*	if (oldValue == undefined && mail != "" && password != ""){
			Logout()
			resetInput()
			setLoader(false)
			connexionStatusWritable.update(value => value = undefined)
		}*/


		if (mail != "" && password != ""){

			Login();
		}



		/**
		 * Server response for login
		*/

		connexionStatusWritable.subscribe(value => {

			oldValue = value

			showErrors(value)
		})



		io.on("login-res", (res) => {

			if (res.status == undefined){
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

					bad_credentials = false
					resetInput()

					goto("/")
				}
			}

		})
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

	/**
	 * Can be username or mail
	 */
	function Login() {
		setLoader(true)
		connexionStatusWritable.update(value => value = ConnexionStatus.Connecting)

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
			<p class="mt-5 text-rose-600 text-center">{credentialsMessage}</p>
		{/if}
	</div>
</div>