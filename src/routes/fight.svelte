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

        actualUser = actualUser
        enemyUser = enemyUser

        generatePlayGround(".EnemyTrail")
        generatePlayGround(".MyTrail")
    })

    var PLAY_ACTUAL = []
    var PLAY_ENNEMY = []

    function generatePlayGround(className) {
        let container = document.querySelector(className)

        for(let i = 0; i<6; i++) {
            let div = document.createElement('div')
            div.classList.add('trail')
            container.appendChild(div)
        }
    }
    afterUpdate(() => {
        document.querySelector('.EnemyHpBar').style.height = enemyUser.life * 5 + "%"
        document.querySelector('.MyHpBar').style.height = actualUser.life * 5 + "%"
    })

</script>

<link rel='stylesheet' href='static/css/fight.css'>

<Loader></Loader>

<div class="flex flex-row backgroundsize">
    <div class="flex flex-col  w-5/6">
        <div class="flex flex-row EnemyDeck mb-1">
            <div class="EnemyHand p-4 pl-12 pr-16 flex flex-row">
                {#if actualUser.deck != undefined}
                    {#each actualUser.deck[0].listCards as card}
                        <img src="static/assets/card_back.png" alt="" class="EnemyCard mr-4">
                    {/each}
                {/if}
            </div>
        </div>
        <div class="tray ">
            <div class="undertray flex flex-col">
                <div class="EnemyTrail">

                </div>

                <div class="MyTrail">

                </div>
            </div>
        </div>
        <div class="flex flex-row MyDeck mt-1">
            <div class="MyHand p-4 pl-12 pr-16 flex flex-row">
                {#if actualUser.deck != undefined}
                    {#each actualUser.deck[0].listCards as card}
                        <img alt="{card.path}" src="http://51.210.104.99:8001/getImage/{card.path}" class="MyCard mr-4">
                    {/each}
                {/if}
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
                        {#each Array(game.maxMana) as _, row}
                            {#if row < 10 - enemyUser.mana}
                                <div class="EnergyEmpty"></div>
                            {:else}
                                <div class="EnergyFull"></div>
                                
                            {/if}
                        {/each}
                    </div>
                    <div class="EnemyHp">
                        <div class="MaxHp">
                            <div class="EnemyHpBar">
                                <div class="EnemyHpTxt">
                                    { 
                                        enemyUser.life || ""
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
                        {#each Array(game.maxMana) as _, row}
                            {#if row < 10 - actualUser.mana}
                                <div class="EnergyEmpty"></div>
                            {:else}
                                <div class="EnergyFull"></div>
                                
                            {/if}
                        {/each}
                    </div>
                    <div class="MyHp">
                        <div class="MaxHp">
                            <div class="MyHpBar">
                                <div class="MyHpTxt">
                                    { 
                                        actualUser.life || ""
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