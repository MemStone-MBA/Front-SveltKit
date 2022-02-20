<link rel='stylesheet' href='static/css/index.css'>
<script>
	import Friend from '../components/friendmenu.svelte';
    import { user } from './auth.js'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Loader from '../components/loader.svelte';

    var userName = $user ? $user.username : "no user"
    var userLevel = $user ? $user.level : 25
    var userMMR = $user ? $user.mmr : 1080

    var ratio = $user ? $user.game_lose > 0 ? $user.game_win / $user.game_lose : 1 : 0.5

    ratio = Math.round(ratio * 100) / 100

    var circleDeg = Math.round(180 * ratio)

    onMount(() => {

        var mask = document.querySelector('.mask.full')
        var circleFill = document.querySelectorAll('.circle .fill')

        // @ts-ignore
        mask.style = "transform: rotate("+circleDeg+"deg)"

        circleFill.forEach((element) => {
            // @ts-ignore
            element.style = "transform: rotate("+circleDeg+"deg)"
        })
    });

    function goToCollection() {
        goto("/collection")
    }

    function logOut() {
        $user = null
        window.localStorage.clear();
        goto("/login")
    }

</script>

<Loader></Loader>

<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-3/4 flex flex-col ">
        <div class='content-center w-1/4 mx-auto mt-6'>
            <img src='static/assets/memstone_logo.png' class='img-contain'>
        </div>
        <div class="flex flex-1 flex-col flexBetween">
            <div class="m-4 ml-12 flex flex-row">
                <div class="flex flex-col justify-end buttonDetail">
                    <div class="profilImage" on:click={logOut}>
                        <img src="static/assets/avatar.svg" alt="" class="profil">
                    </div>
                </div>  
                <div class="flex flex-col ml-8 boxName justify-end">
                    <div class="flex flex-row justify-between">
                        <div class="profilName ">
                            {userName}
                        </div>
                        <div class="lvlExp">
                            lvl {userLevel}
                        </div>
                    </div>
                    <div class="bigExp">
                        <div class="littleExp">
    
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row m-4 ml-12 middleitem">
                <div class="flex flex-col justify-around">
                    <div class="divmenu flex buttonDetail">
                        <img src="static/assets/icon_settings.svg" alt="" class="itemmenu">
                    </div>
                    <div class="divmenu flex buttonDetail">
                        <img src="static/assets/icon_pack.svg" alt="" class="itemmenu">
                    </div>
                    <div class="divmenu flex buttonDetail">
                        <img src="static/assets/icon_shop.svg" alt="" class="itemmenu">
                    </div>
                </div>
                <div class="MMR ml-8">
                    <div class="flex flex-row w-full h-full">
                        <div class="flex flex-col justify-around m-auto">
                            <div class="flex flex-row justify-center txtpack my-4">
                                <div class="nbpack mr-2">
                                    1
                                </div>
                                <div class="pack">
                                    pack
                                </div>
                            </div>
                            <div class="flex justify-center my-4">
                                <img src="static/assets/icon_pack.svg" alt="" class="packlight">
                                <div class="iconpack">
                                </div>
                            </div>
                            <div class="buttonOpen my-4 buttonDetail">
                                Ouvrir
                            </div>
                        </div>
                        <div class="flex flex-col justify-around m-auto">
                            <div class="txtMMR">
                                MMR : {userMMR}
                            </div>

                            <div class="circle-wrap">
                                <div class="circle">
                                  <div class="mask full">
                                    <div class="fill"></div>
                                  </div>
                                  <div class="mask half">
                                    <div class="fill"></div>
                                  </div>
                                  <div class="inside-circle"> 
                                      <span>W/L</span> 
                                      <span>{ratio}</span>
                                    </div>
                                </div>
                              </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row footer px-4">
                <div on:click={goToCollection} class="flex-1 flex flex-row items-center justify-center borderyellow buttonDetail">
                    <div class="buttonCollection mr-4">
                        Collection
                    </div>
                    <div>
                        <img src="static/assets/deck.svg" class="deckImage">
                    </div>
                </div>
                <div class="buttonFight p-8 flex-1 buttonDetail">
                    Combat
                </div>
            </div>
        </div>
    </div>
    <Friend></Friend>
</div>

