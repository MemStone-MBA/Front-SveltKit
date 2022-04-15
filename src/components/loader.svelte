
<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { user, isLog, loaderStatusWritable, userCasesWritable, userCardObtained } from '../routes/auth';
    import { io } from '$lib/realtime.ts';

    let wait = false;
    loaderStatusWritable.subscribe(value => {
        //console.log(value)
        wait = value;
    })





    var display = true

    onMount(() => {


        if (!location.pathname.includes("/login")){


        let jwt =  localStorage.getItem('jwt') ? localStorage.getItem('jwt') : "";
        io.emit("login-check", {jwt}, ((res) => {

            console.log(res)

            if (res.status != 200){

                $user = null;
                localStorage.setItem('jwt',"")
                localStorage.setItem('username', "")
                localStorage.setItem('password', "")
                goto("/login")



            }

            user.set(res.data);


        }))
        }
    })




</script>

{#if wait && display}
<!-- {#if display} -->
<section class="pageLoader">
    <div class="lds-ripple">
        <div></div>
        <div></div>
    </div>
</section>
<!-- {/if} -->
{/if}