<link rel='stylesheet' href='static/css/matchmaking.css'>
<link rel='stylesheet' href='static/css/index.css'>

<script>
	import Friend from '../components/friendmenu.svelte';
</script>


<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-3/4 flex flex-col ">
        <div class='content-center w-1/4 mx-auto mt-6'>
            <img src='static/assets/memstone_logo.png' class='img-contain'>
        </div>
        <div class="divmatch">
            <div>
                En recherche de matchmaking ...
            </div>
        </div>
        <div class="ButtonExit">
            Annuler
        </div>
    </div>
    <Friend></Friend>
</div>