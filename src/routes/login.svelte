
<script lang="ts">
	import { io } from "$lib/realtime";
	import { onMount } from "svelte";


	let username = ""
	let password = ""

	let data_error;
	let data_reult;


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

		io.emit("connect", {username,password}) // Send the message
	}
</script>

<link rel='stylesheet' href='static/css/login.css'>

<div class="back">
    <div class='content-center w-1/3 mx-auto pt-12'>
        <img src='static/assets/memstone_logo.png' class='img-contain'>
    </div>
    <div class="items-center w-1/2">
        <div class="flex flex-col">
            <input type="text" placeholder="Username">
        </div>
        
    </div>
</div>