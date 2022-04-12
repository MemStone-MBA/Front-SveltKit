<script>
// @ts-nocheck

    import Loader from "../components/loader.svelte";
    import { user, dataMatch } from './auth';
    import { afterUpdate, onMount } from 'svelte';
    import { io } from "$lib/realtime";
import { Layers } from "three";


    var game = {}
    var actualUser = {}
    var enemyUser = {}

    onMount(() => {
        game = $dataMatch.game
        actualUser = $dataMatch.game[$user.id]
        let enemyUserArray = Object.entries(game).filter((param) => param[1].user && param[1].user.id != actualUser.user.id)
        enemyUser = enemyUserArray[0][1]
        console.log(actualUser)
        console.log(enemyUser)
    })

    afterUpdate(() => {
        Document.querySelector('.EnemyHpBar').style.height = enemyUser.life * 5
        Document.querySelector('.MyHpBar').style.height = actualUser.life * 5
        Document.querySelector('.EnemyHpBar').style.height = enemyUser.life * 5
        Document.querySelector('.MyHpBar').style.height = actualUser.life * 5
    })


</script>

<link rel='stylesheet' href='static/css/fight.css'>

<Loader></Loader>

<div class="flex flex-row backgroundsize">
    <div class="flex flex-col  w-5/6">
        <div class="flex flex-row EnemyDeck mb-1">
            <div class="pioche">
                <img src="static/assets/card_back.png" alt="" class="cardPioche">
            </div>
            <div class="EnemyHand p-4 pl-12 pr-16 flex flex-row">
                <img src="static/assets/card_back.png" alt="" class="EnemyCard mr-4">
                <img src="static/assets/card_back.png" alt="" class="EnemyCard mr-4">
                <img src="static/assets/card_back.png" alt="" class="EnemyCard mr-4">
                <img src="static/assets/card_back.png" alt="" class="EnemyCard mr-4">
                <img src="static/assets/card_back.png" alt="" class="EnemyCard mr-4">
                <img src="static/assets/card_back.png" alt="" class="EnemyCard mr-4">
                <img src="static/assets/card_back.png" alt="" class="EnemyCard">
            </div>

        </div>
        <div class="tray ">
            <div class="undertray flex flex-col">
                <div class="EnemyTrail flex flex-row">
                    <img src="static/assets/card_front.png" alt="" class="CardTrail">
                    <img src="static/assets/card_front.png" alt="" class="CardTrail">
                </div>
                <div class="MyTrail flex flex-row">
                    <img src="static/assets/card_front.png" alt="" class="CardTrail">
                    <img src="static/assets/card_front.png" alt="" class="CardTrail">
                    <img src="static/assets/card_front.png" alt="" class="CardTrail">
                </div>
            </div>
        </div>
        <div class="flex flex-row MyDeck mt-1">
            <div class="pioche">
                <img src="static/assets/card_back.png" alt="" class="cardPioche">
            </div>
            <div class="MyHand p-4 pl-12 pr-16 flex flex-row">
                <img src="static/assets/card_front.png" alt="" class="MyCard mr-4">
                <img src="static/assets/card_front.png" alt="" class="MyCard mr-4">
                <img src="static/assets/card_front.png" alt="" class="MyCard mr-4">
                <img src="static/assets/card_front.png" alt="" class="MyCard mr-4">
                <img src="static/assets/card_front.png" alt="" class="MyCard mr-4">
                <img src="static/assets/card_front.png" alt="" class="MyCard mr-4">
                <img src="static/assets/card_front.png" alt="" class="MyCard mr-4">
            </div>
        </div>
    </div>
    <div class="flex-1 rightContainer m-1">
        <div class="flex flex-col h-full">
            <!-- 
                ENNEMY
            -->
            <div class="EnemyInfo flex-1 flex flex-col">
                <div class="titleRightContainer">
                    { 
                        enemyUser.user?.username || ""
                    }
                </div>
                <div class="flex-1 flex flex-row">
                    <div class="EnemyEnergy flex flex-col">
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyFull"></div>
                        <div class="EnergyFull"></div>
                        <div class="EnergyFull"></div>
                        <div class="EnergyFull"></div>
                    </div>
                    <div class="EnemyHp">
                        <div class="MaxHp">
                            <div class="EnemyHpBar">
                                <div class="EnemyHpTxt">
                                    { 
                                        enemyUser.user?.life || ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 
                USER
            -->
            <div class="MyInfo h-full flex-1 flex flex-col">
                <div class="titleRightContainer">
                    { 
                        actualUser.user?.username || ""
                    }
                </div>
                <div class="flex-1 flex flex-row">
                    <div class="MyEnergy flex flex-col">
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyEmpty"></div>
                        <div class="EnergyFull"></div>
                        <div class="EnergyFull"></div>
                        <div class="EnergyFull"></div>
                        <div class="EnergyFull"></div>
                        <div class="EnergyFull"></div>
                    </div>
                    <div class="MyHp">
                        <div class="MaxHp">
                            <div class="MyHpBar">
                                <div class="MyHpTxt">
                                    { 
                                        actualUser.user?.life || ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>