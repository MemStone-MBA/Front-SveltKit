<script>
    import { onMount } from 'svelte';

    onMount(() => {
        document.querySelector('.closeFriendMenu').addEventListener('click', () => {
            document.querySelector('.friend').classList.toggle('closeFriendMenuTransition')
        })
    })
</script>

<div class="colorbackfriend w-1/4 text-2xl friend">
    <h1 class="justify-content p-6 pl-0 ml-8 uppercase titlefriend">
        Amis
    </h1>
    <div class="listfriend m-6">
        <div class="onefriend m-4 p-4 text-black">
            <div class="pl-4">
                Guillian
            </div>  
        </div>
        <div class="onefriend m-4 p-4 text-black">
            <div class="pl-4">
                Kirtsu
            </div>  
        </div>
    </div>
    <div class="closeFriendMenu">X</div>
</div>

<style>
    .closeFriendMenu {
        position: absolute;
        background-color: red;
        transition: 1s all ease-in-out;
    }

    .closeFriendMenuTransition {
        transform: translate(100%) !important;
    }
</style>


