
<script>
import { onMount } from "svelte";
import { user } from "../routes/auth";
import { io } from "$lib/realtime";
import { Status } from "$lib/Status";

	export let name
	export let matchmakingStatus
	export let status
	export let friendId

	let popup;
	let friendContainer;
	onMount(() => {

		console.log({
			name,
			matchmakingStatus,
			friendId

		})

		popup = document.querySelector("#popup")
		friendContainer = document.querySelector("#friend-container")
		
		popup.addEventListener("mouseleave",e=>{
	
			 popup.classList.remove("optionFriend-open")
		})


		io.on("matchmakingFriend-duel",(res)=>{
			matchmakingStatus = res.matchmakingStatus
			console.log(res)
		})

		io.on("matchmakingFriend-fight",(res)=>{
			matchmakingStatus = res.matchmakingStatus
			console.log(res)
		})

		io.on("matchmakingFriend-cancel",(res)=>{
			matchmakingStatus = res.matchmakingStatus
			console.log(res)
		})
    })
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

	.disconnected{
      background: red;
	}

</style>