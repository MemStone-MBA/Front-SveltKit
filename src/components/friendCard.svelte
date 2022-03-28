
<script>
import { onMount } from "svelte";
import { user } from "../routes/auth";
import { io } from "$lib/realtime";

	export let name
	export let connected
	export let friendId

	let popup;
	let friendCap;
	let friendContainer;
	onMount(() => {
		popup = document.querySelector("#popup")
		friendContainer = document.querySelector("#friend-container")
		
		popup.addEventListener("mouseleave",e=>{
	
			 popup.classList.remove("optionFriend-open")
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
			io.emit('matchmakingFriend', ({userId:$user.id, userFriendId:friendId }) )
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
		{name} <div class="pastille {connected === true ? 'connected' : 'disconnected'} "></div>
	</div>
</div>
<div on:click={fightClicked} id="popup" class="inline p-4 text-black relative onefriend optionFriend cursor-pointer">
	Fight
</div>

<style>

	.optionFriend{
	 background-color: 	#E7C318;
	 position: absolute;
     transition: all ease 0.5s;
	 opacity: 0;
	 pointer-events: none;
	}

	.optionFriend:hover{
	 background-color: 	#bda321;
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