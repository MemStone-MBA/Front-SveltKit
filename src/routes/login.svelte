
<script lang="ts">
	import { io } from "$lib/realtime";
	import { onMount } from "svelte";

	var username = ""
	var password = ""

	var data_error;
	var data_reult;

	onMount(() => {
		io.on("connect-res", res => { // Listen to the message event
			data_reult = res;
		})
		io.on("connect-err", err => { // Another listener for the name:
			data_error = err // Update the name so it can be displayed
		})
	})

	function Login() {
		username = username.trim()
		if(!username) return

		password = password.trim()
		if(!password) return

		console.log(username)
		console.log(password)

		io.emit("login", {username,password}) // Send the message
	}
</script>

<link rel='stylesheet' href='static/css/login.css'>

<div class="back">
    <div class='content-center w-1/3 mx-auto pt-12'>
        <img src='static/assets/memstone_logo.png' class='img-contain'>
    </div>
    <div class="w-1/3 m-auto">
        <input class="loginform" type="text" placeholder="Username" bind:value={username}>
        <input class="loginform" type="password" placeholder="Password" bind:value={password}>
        <div class="play" on:click={Login}>Se connecter</div>
    </div>
</div>