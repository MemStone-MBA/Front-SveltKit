<link rel='stylesheet' href='static/css/index.css'>
<script>
	  import Friend from '../components/friendmenu.svelte';
    import {
        loaderStatusWritable,
        user,
        userCardObtained,
        userCasesWritable,
        setLoader,
        isLog
    } from './auth.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { io } from '$lib/realtime.ts';
    import { onDestroy } from 'svelte/internal';
    import FriendPopup ,{  show , hide }  from "../components/friendPopup.svelte";
    import {popupTextWritable, popupAcceptWritable, popupDenyWritable }  from '../lib/Popup.js';


    var userName;
    var userRawLevel;
    var userLevel
    var userExp = 0;
    var userMMR
    var userIcon
    var ratio
    var circleDeg


    onMount(() => {

        var mask = document.querySelector('.mask .full')
        var circleFill = document.querySelectorAll('.circle .fill')

        if(mask !== null)
            mask.style = "transform: rotate("+circleDeg+"deg)"

        circleFill.forEach((element) => {

            if(element !== null)
                element.style = "transform: rotate("+circleDeg+"deg)"
        })

        isLog((done) =>{

            userName = $user ? $user.username : "no user"
            userRawLevel = $user ? $user.Level : 0.00
            userLevel = userRawLevel ? parseInt(userRawLevel) : 0
            if(userRawLevel.toString().split('.').length > 1)
                userExp = userRawLevel ? parseInt(userRawLevel.toString().split('.')[1]) : 0
            userMMR = $user ? $user.mmr : 1080
            userIcon = $user ? $user.Icon : "avatar.svg"

            try {
                ratio = Math.round(($user.game_win+1) / ($user.game_lose+1) * 100) / 100
                ratio = Math.round(ratio * 100) / 100
            } catch {
                ratio = 0
            }
            circleDeg = Math.round(180 * ratio)

            io.emit("getUserCases", {jwt:$user?.jwt,userId:$user?.id}, ((res) => {
                if(res.status != 200) {
                    return
                }
                userCasesWritable.set(res);

            }))

            done();


        },_=>{

        })

    });


    function openUserCases(baseCase){

        if (baseCase.count > 0){


            io.emit("openUserCase", {jwt:$user.jwt,userId:$user.id,cards:baseCase.cards, case:baseCase.userCases.shift()}, ((res,cardId) => {

                if(res.status != 200) {
                    return
                }
                userCasesWritable.set(res);
                userCardObtained.set(cardId)
                goto("/opening")
            }))
        }


    }

    function goToCollection() {
        goto("/collection")
    }

    function goToOpening() {
        goto("/opening")
    }

    function goToShop() {
        goto("/shop")
    }

    function goToMM() {
        io.emit("deck-user", { jwt: $user.jwt, userId: $user.id }, ((res) => {
            if(res[0].listCards.length > 0) {
                goto("/matchmaking")
            } else {
                show();
                popupTextWritable.update(popup => popup= `Please create a deck before matchmaking`)
                popupAcceptWritable.update(acceptFunction => acceptFunction = ()=>{ 
                    goto("/collection")
                    hide()
                })
                popupDenyWritable.update(denyFunction => denyFunction = ()=>{
                    hide()
                })
            }
        }))
    }

    function goToCases() {
        goto("/cases")
    }

    function logOut() {
        $user = null
        window.localStorage.clear();
        setLoader(true)
        goto("/login")
    }

</script>





<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-full flex flex-col ">
        <!-- <div class='content-center w-1/4 mx-auto mt-6'>
            <img alt="Memstone Logo" src='static/assets/memstone_logo.png' class='img-contain'>
        </div> -->
        <div class="flex flex-1 flex-col flexBetween">
            <div class="m-4 ml-12 flex flex-row">
                <div class="flex flex-col justify-end buttonDetail">
                    <div class="profilImage" on:click={logOut}>
                        <img alt="Avatar" src="static/assets/{userIcon}" class="profil">
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
                        <div class="littleExp" style="width:{userExp}%">
    
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row m-4 ml-12 middleitem">
                <div class="flex flex-col justify-around">
                    <div class="divmenu flex buttonDetail">
                        <img src="static/assets/icon_settings.svg" alt="" class="itemmenu">
                    </div>
                    <div on:click={goToCases} class="divmenu flex buttonDetail">
                        <img src="static/assets/icon_pack.svg" alt="" class="itemmenu">
                    </div>
                    <div on:click={goToShop} class="divmenu flex buttonDetail">
                        <img src="static/assets/icon_shop.svg" alt="" class="itemmenu">
                    </div>
                </div>
                <div class="MMR ml-8">
                    <div class="flex flex-row w-full h-full">

                        {#if $userCasesWritable != null && $userCasesWritable.cases[0] != null && $userCasesWritable.cases[0] != undefined }

                            <div class="flex flex-col justify-around m-auto">
                                <div class="flex flex-row justify-center txtpack my-4">
                                    <div class="nbpack mr-2">
                                        1
                                    </div>
                                    <div class="pack">
                                        { $userCasesWritable.cases[0].name }
                                    </div>
                                </div>
                                <div class="flex justify-center my-4">
                                    <img src="static/assets/icon_pack.svg" alt="" class="packlight">
                                    <div class="iconpack">
                                    </div>
                                </div>
                                <div on:click={openUserCases( $userCasesWritable.cases[0])} class="buttonOpen my-4 buttonDetail">
                                    Ouvrir
                                </div>
                            </div>

                            {:else }
                            <div class="flex flex-col justify-around m-auto">
                                <div class="flex flex-row justify-center txtpack my-4">
                                    <div class="nbpack mr-2">
                                        0
                                    </div>
                                    <div class="pack">
                                        Case
                                    </div>
                                </div>
                                <div class="flex justify-center my-4">
                                    <img src="static/assets/icon_pack.svg" alt="" class="packlight">
                                    <div class="iconpack">
                                    </div>
                                </div>
                                <div  class="buttonOpen disableElement my-4 buttonDetail">
                                    Ouvrir
                                </div>
                            </div>

                        {/if}


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
                <div on:click={goToMM} class="buttonFight p-8 flex-1 buttonDetail">
                    Combat
                </div>
            </div>
        </div>
    </div>

    <!-- <div on:click={showFriends} class="absolute showFriends divmenu buttonDetail top-0.5 right-0.5">
        <img src="static/assets/icon_friend.png" alt="" class="itemmenu">
    </div> -->
</div>
<Friend ></Friend>

