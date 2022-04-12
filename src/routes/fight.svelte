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

        console.log(actualUser)
        console.log(enemyUser)

        //generatePlayGround(".EnemyTrail", "e", enemyUser.playGround)
        generatePlayGround(".MyTrail", "m", actualUser.playGround, true)
    })

    io.on('updateUserPlayground', game => {
        let enemyUserArray2 = Object.entries(game).filter((param) => param[1].user && param[1].user.id != actualUser.user.id)
        let newPlayground = enemyUserArray2[0][1].playGround

        if(newPlayground && newPlayground != [])
            buildEnemyPlayground(newPlayground)
    })

    function buildEnemyPlayground(playground) {
        let htmlPG = document.querySelector('.EnemyTrail')
        htmlPG.innerHTML = ""
        console.log(playground)
        for (let i = 0; i < playground.length; i++) {

            
            let div = document.createElement('div')
            div.classList.add('trail')

            if(playground[i].card) {
                let img = document.createElement("img")
                img.src = "http://51.210.104.99:8001/getImage/"+ playground[i].card.path
                div.appendChild(img)
            }
            
            htmlPG.appendChild(div)
        }
    }

    var selectedCard = null
    var selectedFrame = null

    function checkPose() {
        if(selectedCard && selectedFrame) {

            let dataId = selectedFrame.getAttribute('data-id')
            let actualFrame = actualUser.playGround.find(frame => frame.id == dataId)

            if(actualFrame.empty) {
                document.querySelector('.CARD_' + selectedCard.id).remove()
                actualFrame.empty = false
                actualFrame.card = selectedCard
                let img = document.createElement("img")
                img.src = "http://51.210.104.99:8001/getImage/"+ selectedCard.path
                selectedFrame.appendChild(img)
                selectedCard = null
                selectedFrame = null

                console.log($dataMatch)
                io.emit('updateUserPlayground', {
                    id: game.id,
                    modifyId: actualUser.user.id,
                    playGround: actualUser.playGround
                })
            }
        }
    }

    function generatePlayGround(className, attr, array, event) {
        let container = document.querySelector(className)

        for(let i = 0; i<6; i++) {
            let div = document.createElement('div')
            div.classList.add('trail')
            div.setAttribute('data-id', attr + "_" + i)

            if(event) {
                // selectedFrame = div
                div.addEventListener('click', () => {
                    console.log(div)
                    selectedFrame = div
                    checkPose()
                })
            }

            container.appendChild(div)
            array.push({id: attr + "_" + i, div: div, empty: true})
        }
    }
    afterUpdate(() => {
        document.querySelector('.EnemyHpBar').style.height = enemyUser.life * 5 + "%"
        document.querySelector('.MyHpBar').style.height = actualUser.life * 5 + "%"
    })

    function setSelectedCard(el) {
        console.log(el)
        selectedCard = el
    }

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
                        <img 
                            alt="{card.path}" 
                            src="http://51.210.104.99:8001/getImage/{card.path}" 
                            class="MyCard mr-4 CARD_{card.id}"
                            on:click={() =>{
                                setSelectedCard(card)
                            }}
                        >
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