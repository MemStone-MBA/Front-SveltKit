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
        for (let i = 0; i < playground.length; i++) {

            let div = document.createElement('div')
            div.classList.add('trail')

            if(playground[i].card) {
                let img = document.createElement("img")
                img.src = "http://51.210.104.99:8001/getImage/"+ playground[i].card.path
                img.classList.add('CardTrail')
                img.id = playground[i].card.id
                img.classList.add(`CARD_AGRO_${playground[i].card.id}`)
                img.classList.add('boardCard')
                img.classList.add('selectedAgroCard')

                img.addEventListener('click', () => {
                    //selectOneCard(`.CARD_AGRO_${img.id}`, ".boardCard", "selectedAgroCard")
                    selectedAgro = playground[i].card
                    console.log(playground)
                    attack()
                })
                let HpMaxCard = document.createElement("div")
                HpMaxCard.classList.add('MaxHpCard')
                let HpCard = document.createElement("div")
                HpCard.classList.add('HpCard')
                HpMaxCard.classList.add('HP_' + enemyUser.user.id + "_" +playground[i].card.Id)

                let newHP = playground[i].card.life * 100 / playground[i].card.maxLife + "%"

                HpCard.style.width = newHP

                div.appendChild(img)
                HpMaxCard.appendChild(HpCard)
                div.appendChild(HpMaxCard)
            }
            
            htmlPG.appendChild(div)
        }
    }

    var selectedCard = null
    var selectedFrame = null

    var selectedFight = null
    var selectedAgro = null

    function attack() {
        var damage = selectedFight.damage 
        var newLife = selectedAgro.life - damage

        if(newLife <= 0) {
            enemyDamageUser(newLife)
            destroyCard(selectedAgro)
        } else {
            changeLife(selectedAgro, newLife)
        }

        let cardsF = document.querySelectorAll('selectedFightCard')
        for(let c of cardsF) {
            c.classList.remove('selectedFightCard')
        }

        let cardsA = document.querySelectorAll('selectedAgroCard')
        for(let c of cardsA) {
            c.classList.remove('selectedAgroCard')
        }

        selectedAgro = null
        selectedFight = null
    }

    io.on('updateLife', (data) => {
        console.log(data)
        buildEnemyPlayground(data[enemyUser.user.id].playGround)
        // let HpCard = document.querySelector(`.HpCard_${card.id}`)
        // HpCard.style.width = `${newLife}%`
    })

    function changeLife(card, newLife) {
        io.emit('changeCardLife', {game: game, idUser: enemyUser.user.id, card: card, newLife: newLife})
    }

    function enemyDamageUser(damage) {
        io.emit('sendDamageUser', {game: game, damage: damage * -1})
    }

    function destroyCard(card) {
        io.emit('sendDamageUser', {game: game, card: card})
    }

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
                img.classList.add('boardCard')
                img.classList.add(`CARD_FIGHT_${selectedCard.id}`)
                img.id = selectedCard.id

                let copy = selectedCard.valueOf()

                img.addEventListener('click', () => {
                    selectOneCard(`.CARD_FIGHT_${img.id}`, ".boardCard", "selectedFightCard")
                    selectedFight = copy
                })

                img.classList.add('CardTrail')

                let HpMaxCard = document.createElement("div")
                HpMaxCard.classList.add('MaxHpCard')
                let HpCard = document.createElement("div")
                HpCard.classList.add('HpCard')
                HpMaxCard.classList.add('HP_' + actualUser.user.id + "_" + selectedCard.id)
                actualFrame.card.maxLife = actualFrame.card.life
                
                selectedFrame.appendChild(img)
                HpMaxCard.appendChild(HpCard)
                selectedFrame.appendChild(HpMaxCard)
                
                selectedCard = null
                selectedFrame = null

                io.emit('updateUserPlayground', {
                    id: game.id,
                    modifyId: actualUser.user.id,
                    playGround: actualUser.playGround
                })

                selectedCard = null
                selectedFrame = null
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
                div.addEventListener('click', () => {
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
        selectOneCard(`.CARD_${el.id}`, ".MyCard", "selectedCard")
        selectedCard = el
    }

    function selectOneCard(cardName, allCards, className) {
        let card = document.querySelector(cardName)
        let cards = document.querySelectorAll(allCards)

        for(let c of cards) {
            c.classList.remove(className)
        }
        card.classList.add(className)
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