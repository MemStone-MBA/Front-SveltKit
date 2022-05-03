
<script>
    import { onMount } from 'svelte';
    import {  loaderStatusWritable } from '../routes/auth';

    let wait = true;
    loaderStatusWritable.subscribe(value => {
        //console.log(value)
        wait = value;
    })

    onMount(() => {
        if(window.location.pathname == "/landing") {
            wait = false
        }
    })
</script>

{#if wait}
<!-- {#if display} -->
<section class="pageLoader">
    <div class="lds-ripple">
        <div></div>
        <div></div>
    </div>
</section>
<!-- {/if} -->
{/if}