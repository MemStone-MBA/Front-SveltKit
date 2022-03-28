
<script>

	export let name
	export let connected
	export let friendId

	function friendClicked(){
		console.log(friendId);
	}

</script>

<div on:click={friendClicked } class="onefriend m-4 p-4 text-black relative">
	<div class="pl-4 overflow-hidden">
		{name} <div class="pastille {connected === true ? 'connected' : 'disconnected'} "></div>
	</div>
</div>

<style>

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