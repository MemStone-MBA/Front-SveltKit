
<script>
import { onMount } from "svelte";
import { user,dataMatch } from "../routes/auth";
import { io } from "$lib/realtime";
import { goto } from '$app/navigation';
import { Status, MatchmakingStatus } from "$lib/Status";
import FriendPopup ,{  show , hide }  from "./friendPopup.svelte";
import {popupTextWritable, popupAcceptWritable, popupDenyWritable }  from '../lib/Popup.js';

	export let name
	export let matchmakingStatus
	export let status
	export let friendId


	let popup;
	let friendCap;
	let friendContainer;
	onMount(() => {

		console.log({
			name,
			matchmakingStatus,
			friendId

		})


		popup = document.querySelector("#popup")
		friendContainer = document.querySelector("#friend-container")
		friendCap = document.querySelector("#friend-cap")
		

		popup.addEventListener("mouseleave",e=>{
	
			 popup.classList.remove("optionFriend-open")
		})


		io.on("matchmakingFriend-duel",(res)=>{
			console.log(res)
			checkStatus(res.status,_=>{

				checkMatchmakingStatus(res.matchmakingStatus,_=>{
					console.log(res.matchmakingStatus);
					switch (res.matchmakingStatus) {

						

                        case MatchmakingStatus.IsWaited:
							show();
							popupTextWritable.update(popup => popup= `${name} is waiting you for a duel !`)
							popupAcceptWritable.update(acceptFunction => acceptFunction = ()=>{ 

								checkUser(_=>{
									io.emit('matchmakingFriend-duel', ({userId:$user.id, userFriendId:friendId }) )
								})

								
							
							})

							popupDenyWritable.update(denyFunction => denyFunction = ()=>{
								checkUser(_=>{
									hide();
									io.emit('matchmakingFriend-cancel', ({userId:friendId , userFriendId: $user.id}) )
								})
							})


                            break;
                        case MatchmakingStatus.IsWaiting:

							friendCap.classList.add("card-IsWaiting")
						
                            break;
                        case MatchmakingStatus.Cancelled:
							friendCap.classList.remove("card-IsWaiting")
							
                            break;
                        case MatchmakingStatus.InMatch:
							

                            break;
                        default:
                            console.error(`matchmakingStatus : ${res.matchmakingStatus} is null or wrong Type`)
                            break;
                    }
				})
				
			})

			matchmakingStatus = res.matchmakingStatus
			console.log(res)
		})

		io.on("matchmakingFriend-fight",(res)=>{

			friendCap.classList.remove("card-IsWaiting")

			let actualUser = res.actualUser ;
			let selectedUser = res.selectedUser;

			$dataMatch = {actualUser, selectedUser}
			goto('/fight')

			console.log(res)
		})

	
    })

	function checkStatus(status,callback){

		if(status == null ||  typeof status !== 'string' ){
			console.error("missing status checkStatus in firendCard.svelte")
			return;
		}

		if(status != Status.Connected){
			console.error("User is not connected")
			return;
		}

		if(callback != null &&  typeof callback === 'function'){
			callback();
		}

	}

		function checkMatchmakingStatus(matchmakingStatus,callback){

		if(matchmakingStatus == null ||  typeof matchmakingStatus !== 'string' ){
			console.error("missing matchmakingStatus checkStatus in firendCard.svelte")
			return;
		}
		
		if(callback != null &&  typeof callback === 'function'){
			callback();
		}

	}

	function friendClicked(){
		let pos = findPopupCoords()
		console.log(pos);
		
		if(popup!= null){
			popup.style.transform = "translate("+pos.x+"px,"+pos.y+"px)";
			popup.classList.add("optionFriend-open")
		}
			
	}

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

	function fightClicked(){
		popup.classList.remove("optionFriend-open")
		checkUser(_=>{
			io.emit('matchmakingFriend-duel', ({userId:$user.id, userFriendId:friendId }) )
		})

		
	}

	function cancelClicked(){
		popup.classList.remove("optionFriend-open")
		checkUser(_=>{
			io.emit('matchmakingFriend-cancel', ({userId:$user.id, userFriendId:friendId }) )
		})

		
	}

	function findPopupCoords(mouseEvent)
	{
	var xpos
	var ypos;
	if (mouseEvent)
	{
		//FireFox
		xpos = mouseEvent.pageX - popup.offsetLeft;
		ypos = mouseEvent.pageY  - popup.offsetTop;
	}
	else
	{
		//IE
		xpos = window.event.x + document.body.scrollLeft - 2 - friendContainer.offsetLeft - (popup.offsetWidth/2);
		ypos = window.event.y + document.body.scrollTop - 2 - popup.offsetTop ;
	}
		return {'x':xpos , 'y':ypos}
	}

</script>




<div on:click={friendClicked } id="friend-cap" class="onefriend m-4 p-4 text-black relative cursor-pointer">
	<div class="pl-4 overflow-hidden">
		{name}
		
		{#if status == Status.Connected}
			
			<div class="pastille connected"></div>
		{:else if status == Status.AFK}
			<div class="pastille Afk"></div>
		{:else}
			<div class="pastille disconnected"></div>
{/if}
		
	</div>
</div>
<div  id="popup" class="inline text-black relative  optionFriend cursor-pointer">
	
	<div class=" p-4 optionFriend-bubble" on:click={fightClicked}>
		Fight
	</div>
	<div class=" p-4 optionFriend-bubble" on:click={cancelClicked}>
		Cancel
	</div>
</div>

<style>

	.optionFriend{
	 
	 position: absolute;
     transition: all ease 0.5s;
	 opacity: 0;
	 pointer-events: none;
	}

	.optionFriend-bubble:hover{
	 background-color: 	#bda321;
	}

	.optionFriend-bubble{
		border: black 1px solid;
		background-color: 	#E7C318;
		border-radius: 30px;
		transition: all ease 0.5s;
	}
	

	.pastille{
		
      width: 10px;
      height: 10px;
      border-radius: 50px;
      display: inline-block;
      margin: 2px;
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
	}
  .connected{
			background: green;
	}

	.Afk{
			background: orangered;
	}

	.disconnected{
      background: gray;
	}

</style>