<script>
    import { onMount } from 'svelte';
    import FriendCard from './friendCard.svelte';
    import { isLog, user } from '../routes/auth.js';
    import { io } from "$lib/realtime";
    import {Status} from "../lib/Status.js"
    let friends =  []

    var username = ""

    var open = false

    onMount(() => {
        
        isLog((done) =>{    
            
            
        GetFriends()
            
            done();
        },_=>{

        })

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
                friends = []
                res?.forEach(friend =>{
               
                    let friendData = {name:friend.username, status:Status.Disconnected ,friendId:friend.id}
                    io.emit("friend-connexion",({ 'userId':$user.id, 'userFriendId' : friend.id }), (res) => {

                        if(res.status == Status.Connected){
                            friendData.status = Status.Connected
                        }

                        friends.push(friendData)
                        friends = friends
                        //console.log("friends : ",friends)
                    })
                })

                io.on("friend-connexion-status", ((userData)=>{

                    let userFriendId = userData?.userFriendId;
                    let userStatus = userData?.status;
                    let userMatchmakingStatus = userData?.matchmakingStatus;
                    
                    friends.map(friend => {
                        if(friend.friendId == userFriendId){
                            friend.matchmakingStatus = userMatchmakingStatus;
                            friend.status = userStatus;
                            friends = friends;
                        }
                    })


                }))
            }))
        })

        
    
    }

    function AddFriend(){
        let haveFriend = false
        // friends.forEach(element => {
        //     if(element.name == username)
        //         haveFriend = true
        // });
        // if(haveFriend){
            io.emit("getUserByUsername",{jwt: $user.jwt, userID: $user.id, username: username}, (res) => {
            GetFriends()
        // })
        }        
    }

    export function ToggleMenu(){
        open = !open
        let friendMenu = document.querySelector('.friend')
        if (friendMenu.classList.contains("friend-open"))
            friendMenu.classList.remove("friend-open")
        else
            friendMenu.classList.add("friend-open")
    }

</script>

<div id="friend-container" class="colorbackfriend w-1/4 text-2xl friend h-full z-40 ">
    <h1 class="justify-content p-6 pl-0 ml-8 uppercase titlefriend flex flex-row">
        <div>
            Amis
        </div>
    </h1>
    <div class="listfriend m-6">
        <div>
            {#each friends as friend}
            <FriendCard bind:name={friend.name} bind:status={friend.status} bind:matchmakingStatus={friend.matchmakingStatus}  bind:friendId={friend.friendId} ></FriendCard>
        {/each}
        </div>
    </div>
    <div class="flex flex-row addFriend">
        <input type="text" class="inputFriend" bind:value={username}>
        <div class="buttonAddFriend" on:click={()=>{AddFriend()}}>Ajouter</div>
    </div>  
    <div class="closeFriendMenu buttonDetail" on:click={()=>{ToggleMenu()}}>
        {#if open}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        {/if}
        {#if !open}
            <img src="static/assets/icon_friend.png" alt="" class="itemmenu">
        {/if}
    </div>
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
        width: 5vh;
        height: 5vh;
        background-color: #e7c318;
        color: black;
        transform: translateX(-100%);
    }

    .closeFriendMenu svg, .closeFriendMenu img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .addFriend{
        justify-content: center;
        align-items: center;
        margin: 20px;

    }

    .inputFriend{
        width: 100%;
        padding: 5px;
        margin-right: 10px;
        border-radius: 10px;
        background: rgba(196, 196, 196, 0.78);
        color: black;
    }

    .buttonAddFriend {
        border: 1px solid black;
        padding: 5px;
        border-radius: 10px;
        background-color: black;
    }

    .buttonAddFriend:hover {
        color: #e7c318;
        cursor: pointer;
    }
</style>


