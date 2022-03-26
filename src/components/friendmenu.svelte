<script>
    import { onMount } from 'svelte';

    onMount(() => {
       /* document.querySelector('.closeFriendMenu').addEventListener('click', () => {
            document.querySelector('.friend').classList.toggle('closeFriendMenuTransition')
        })*/
    })

    export function ToggleMenu(){

        let friendMenu = document.querySelector('.friend')
        console.log(friendMenu)
        if (friendMenu.classList.contains("friend-open"))
            friendMenu.classList.remove("friend-open")
        else
            friendMenu.classList.add("friend-open")
    }


</script>

<div class="colorbackfriend w-1/4 text-2xl friend h-full z-40">
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
    <div class="closeFriendMenu" on:click={()=>{ToggleMenu()}}>X</div>
</div>

<style>
    .friend{
        position: fixed;
        right: 0;
        top:0;
        transition: 0.5s all ease;
        transform: translateX(100%);

    }


    .closeFriendMenu {
        position: absolute;
        background-color: red;
        transition: 1s all ease-in-out;
    }

</style>


