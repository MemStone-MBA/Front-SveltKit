<link rel='stylesheet' href='static/css/index.css'>
<script>
	import Friend from '../components/friendmenu.svelte';
</script>



<div class="flex flex-row backgroundsize">
    <div class="colorbackmenu w-3/4 flex flex-col ">
        <div class='content-center w-1/4 mx-auto mt-6'>
            <img src='static/assets/memstone_logo.png' class='img-contain'>
        </div>
        <div class="flex flex-1 flex-col flexBetween">
            <div class="m-4 ml-12 flex flex-row">
                <div class="flex flex-col justify-end">
                    <div class="profilImage">
                        <img src="static/assets/avatar.svg" alt="" class="profil">
                    </div>
                </div>  
                <div class="flex flex-col ml-8 boxName">
                    <div class="flex flex-row justify-between">
                        <div class="profilName ">
                            JustinBridou
                        </div>
                        <div class="lvlExp">
                            lvl 25
                        </div>
                    </div>
                    <div class="bigExp mt-8">
                        <div class="littleExp">
    
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row m-4 ml-12 middleitem">
                <div class="flex flex-col justify-around">
                    <div class="divmenu flex">
                        <img src="static/assets/icon_settings.svg" alt="" class="itemmenu">
                    </div>
                    <div class="divmenu flex">
                        <img src="static/assets/icon_pack.svg" alt="" class="itemmenu">
                    </div>
                    <div class="divmenu flex">
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
                            <div class="buttonOpen my-4">
                                Ouvrir
                            </div>
                        </div>
                        <div class="flex flex-col justify-around m-auto">
                            <div class="txtMMR">
                                MMR : 1228
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
                                      <span>0.75</span>
                                    </div>
                                </div>
                              </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row footer px-4">
                <div class="flex-1 flex flex-row items-center justify-center borderyellow">
                    <div class="buttonCollection mr-4">
                        Collection
                    </div>
                    <div>
                        <img src="static/assets/deck.svg" class="deckImage">
                    </div>
                </div>
                <div class="buttonFight p-8 flex-1">
                    Combat
                </div>
            </div>
        </div>
    </div>
    <Friend></Friend>
</div>

