<script>
    import { onMount } from 'svelte';
    import FriendCard from './friendCard.svelte';
    import { user } from '../routes/auth.js';
    import { io } from "$lib/realtime";
    let friends =  []

    onMount(() => {
        GetFriends()


    })

    function checkUser(callback){
       
      if($user != null && typeof $user === 'object' ){
        if (callback != null && typeof callback === "function"){
          callback()
        }else{
          console.error("Missing callback function")
        }
      }else{
        console.error("Missing User")
      
      }
    }


    function GetFriends(){
        checkUser(_=>{

            io.emit("friends-user",{ jwt: $user.jwt, userId: $user.id}, ((res)=>{
            if(res.status) {
                return
            }
            console.log(res)
            res?.forEach(friend =>{
                friends.push({name:friend.username, connected:true, friendId:friend.id})
                friends = friends
            })
            }))
        })
    
    }

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
        {#each friends as friend}
            <FriendCard bind:name={friend.name} bind:connected={friend.connected} bind:friendId={friend.friendId} ></FriendCard>
        {/each}
    </div>
    <div class="closeFriendMenu buttonDetail" on:click={()=>{ToggleMenu()}}><span>X</span></div>
</div>

<style>
    .friend{
        position: fixed;
        right: 0;
        top: 0;
        transition: 0.5s all ease;
        transform: translateX(100%);
        background-color: #383838f0;
    }


    .closeFriendMenu {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: #e7c318;
        color: black;
    }

    .closeFriendMenu span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

</style>


