
<script>
    import {  loaderStatusWritable } from '../routes/auth';




    let wait = true;
    console.log(wait)
    loaderStatusWritable.subscribe(value => {
        //console.log(value)
        wait = value;
        console.log(wait)
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