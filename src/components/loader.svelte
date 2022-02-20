<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { user, isLog } from '../routes/auth';
	//export let display;

    var display = true

    onMount(() => {
        if(!isLog($user)) {
            goto("/login")
        } else {
            display = false
        }
    })

</script>

{#if display}
<section class="pageLoader">
    <div class="lds-ripple">
        <div></div>
        <div></div>
    </div>
</section>
{/if}