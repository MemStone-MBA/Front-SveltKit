<script>
	import { loaderStatusWritable, user } from './auth.js';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { io } from "$lib/realtime";
	import {connexionStatusWritable} from './auth.js';
	import Loader from '../components/loader.svelte';
	import FriendPopup from '../components/friendPopup.svelte';
	import { ConnexionStatus } from '$lib/Status.js';

	var tabID;

	onMount(() => {
        io.on("login-err",(data, callback)=>{
					if (data.status == ConnexionStatus.Replace){
						connexionStatusWritable.update(value => value = ConnexionStatus.Replace )
						logOut();
						callback()
					}
        })

		tabID = sessionStorage.tabID ? sessionStorage.tabID : sessionStorage.tabID = Math.random();

		if (!location.pathname.includes("/login")  ){
			let jwt =  localStorage.getItem('jwt') ? localStorage.getItem('jwt') : "";
			io.emit("login-check", {jwt, tabID }, ((res) => {
				if (res.status != 200){
					if (!location.pathname.includes("/landing")){
						logOut()
					}
					
				}
				user.set(res.data);
			}))
		}

    })

    export function logOut() {
        $user = null
        window.localStorage.clear();
        goto("/login")
    }


    

</script>
<link rel='stylesheet' href='static/css/style.css'>

<Loader></Loader>
<FriendPopup ></FriendPopup>
<!--<Nav/>-->
<!-- Slot représente le reste du code chragé par la page -->
<slot></slot>

<style>
		/* Import Tailwind */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @font-face {
    font-family: Hamston;
    src: url("../../static/font/Hamston.ttf");
    }

    @font-face {
        font-family: "barlow-bold";
        src: url("../../static/font/Barlow-Bold.ttf")
    }

    @font-face {
        font-family: "barlow-medium";
        src: url("../../static/font/Barlow-Medium.ttf")
    }

    @font-face {
        font-family: "barlow-regular";
        src: url("../../static/font/Barlow-Regular.ttf")
    }

    @font-face {
        font-family: "barlow-light";
        src: url("../../static/font/Barlow-Light.ttf")
    }


    @font-face {
        font-family: "barlow-li";
        src: url("../../static/font/Barlow-LightItalic.ttf")
    }

    @font-face {
        font-family: "barlow-sb";
        src: url("../../static/font/Barlow-SemiBold.ttf")
    }


    @font-face {
        font-family: "barlow-sbi";
        src: url("../../static/font/Barlow-SemiBoldItalic.ttf")
    }

    @font-face {
        font-family: "barlow-thin";
        src: url("../../static/font/Barlow-Thin.ttf")
    }

    @font-face {
        font-family: "barlow-eb";
        src: url("../../static/font/Barlow-ExtraBold.ttf")
    }
</style>