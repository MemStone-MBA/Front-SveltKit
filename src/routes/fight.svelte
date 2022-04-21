<script>
// @ts-nocheck

    import Loader from "../components/loader.svelte";
    import { user, dataMatch } from './auth';
    import { afterUpdate, onMount } from 'svelte';
    import { io } from "$lib/realtime";
    import { Layers } from "three";
import { goto } from "$app/navigation";


    var game = {}
    var actualUser = {}
    var enemyUser = {}

    var timer = game.time_round || 25

    io.on('timerDown', (data) => {
        curveCards()
        timer = timer - 1
        if(timer <= 0) {
            if(myTurn())
                changeTurn()
        }
    })

    io.on('timerReset', (data) => {
        timer = game.time_round
    })

    onMount(() => {
        game = $dataMatch.game
        actualUser = $dataMatch.game[$user.id]
        let enemyUserArray = Object.entries(game).filter((param) => param[1].user && param[1].user.id != actualUser.user.id)
        enemyUser = enemyUserArray[0][1]

        actualUser = actualUser
        enemyUser = enemyUser

        generatePlayGround(".MyTrail", "m", actualUser.playGround, true)

        setTimeout(() => {
            curveCards()
        }, 100)
    })

    function curveCards(card = null) {
        let cards = document.querySelectorAll('.curveContainer .curveCard')
        // si pair else impair
        if(cards.length % 2 == 0) {

        } else {
            var limiteTrans = 150
            var limiteRota = 30
            // for card in cards rotate card to form arc
            for(let i = 0; i < cards.length / 2 ; i++) {
                let card = cards[i]

                let angle = i*(150 / (cards.length / 2))

                card.innerHTML = i

                let str = `translateY(${-angle}px) `

                let rota = -limiteRota + i*(limiteRota / (cards.length / 2))
                
                let newRota = `rotate(${rota}deg)`

                if(i == Math.round(cards.length / 2) - 1) { 
                    newRota = ""
                }

                str += newRota
                
                card.style.transform = str
            }

            for(let i = cards.length - 1; i > cards.length / 2; i--) {
                let card = cards[i]
 
                let angle = (cards.length - 1 - i)*(150 / (cards.length / 2))

                card.innerHTML = i

                let str = `translateY(${-angle}px) `

                let rota = limiteRota - (cards.length - 1 - i)*(limiteRota / (cards.length / 2))
                
                let newRota = `rotate(${rota}deg)`

                str += newRota
                
                card.style.transform = str
            }
        }
    }

    function updatePlayground(idUser, playground) {
        game[idUser].playGround = playground
    }

    function updateCardPlayground(idUser, idCard, card) {
        Object.entries(getUserPlaground(idUser)).filter((col) => { return col[1].card && col[1].card.id == idCard }).map((item) => {
            getUserPlaground(idUser)[parseInt(item[0])].card = card
        })
    }

    function getUserPlaground(idUser) {
        return game[idUser].playGround
    }

    function getCardUserPlayground(idUser, idCard) {
        let arrayOBJ = Object.entries(getUserPlaground(idUser)).filter((col) => { return col[1].card && col[1].card.id == idCard })
        return arrayOBJ[0][1]
    }

    function deleteCardPlayground(idUser, idCard) {
        Object.entries(getUserPlaground(idUser)).filter((col) => { return col[1].card && col[1].card.id == idCard }).map((item) => {
            delete getUserPlaground(idUser)[parseInt(item[0])].card
        })
    }

    function deleteCardFromBoard(idUser, idBoard) {
        let prefix = idUser == actualUser.user.id ? "m" : "e"
        let fullPrefix = prefix + "_" + idBoard.split("_")[1]
        document.querySelector("[data-id='" + fullPrefix + "']").innerHTML = ""
    }

    function updatePlaygroundUserLife(user) {
        game[user.user.id].life = user.life
    }

    function updateLifeUser(user) {
        let isActualUser = user.user.id == actualUser.user.id ? true : false

        if(isActualUser) {
            let hpBar = document.querySelector('.MyHpBar')

            let newLife = user.life * 100 / user.maxLife
            newLife = newLife < 0 ? 0 : newLife

            let newHP = newLife + "%"
            hpBar.style.height = newHP

            document.querySelector('.MyHpTxt').innerHTML = user.life
        } else {
            let hpBar = document.querySelector('.EnemyHpBar')

            let newLife = user.life * 100 / user.maxLife
            newLife = newLife < 0 ? 0 : newLife

            let newHP = newLife + "%"
            hpBar.style.height = newHP

            document.querySelector('.EnemyHpTxt').innerHTML = user.life
        }
    }

    function myTurn() {
        try {
            if(game.turn == actualUser.user.id) {
                return true
            } else {
                return false
            } 
        }catch {
            return false
        }
        
    }

    io.on('updateMana', newGame => {
        game[actualUser.user.id].mana = newGame[actualUser.user.id].mana
        game[enemyUser.user.id].mana = newGame[enemyUser.user.id].mana
    })

    io.on('updateUserPlayground', game => {
        let enemyUserArray2 = Object.entries(game).filter((param) => param[1].user && param[1].user.id != actualUser.user.id)
        let newPlayground = enemyUserArray2[0][1].playGround

        updatePlayground(enemyUser.user.id, newPlayground)

        if(newPlayground && newPlayground != [])
            buildEnemyPlayground(newPlayground)

        curveCards()
    })

    function buildEnemyPlayground(playground) {
        let htmlPG = document.querySelector('.EnemyTrail')
        htmlPG.innerHTML = ""
        for (let i = 0; i < playground.length; i++) {

            let div = document.createElement('div')
            div.classList.add('trail')
            div.setAttribute('data-id',  "e_" + i)

            if(playground[i].card) {
                let img = document.createElement("img")
                img.src = "http://51.210.104.99:8001/getImage/"+ playground[i].card.path
                img.classList.add('CardTrail')
                img.classList.add('cardRemove')

                setTimeout(() => {
                    img.classList.remove('cardRemove')
                },10)

                img.id = playground[i].card.id
                img.classList.add(`CARD_AGRO_${playground[i].card.id}`)
                img.classList.add('boardCard')
                img.classList.add('selectedAgroCard')

                img.addEventListener('click', () => {
                    //selectOneCard(`.CARD_AGRO_${img.id}`, ".boardCard", "selectedAgroCard")
                    selectedAgro = img.id
                    attack()
                })
                let HpMaxCard = document.createElement("div")
                HpMaxCard.classList.add('MaxHpCard')
                let HpCard = document.createElement("div")
                HpCard.classList.add('HpCard')
                HpCard.classList.add('HP_' + enemyUser.user.id + "_" +playground[i].card.id)

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
        if(!myTurn())
            return
        
        if(!selectedFight || !selectedAgro)
            return

        var fightCard = getCardUserPlayground(actualUser.user.id, selectedFight).card
        var fightAgro = getCardUserPlayground(enemyUser.user.id, selectedAgro).card

        if(!fightCard || !fightAgro)
            return
        
        var damage = fightCard.damage 
        var newLife = fightAgro.life - damage

        if(newLife <= 0) {
            enemyDamageUser(newLife, enemyUser.user.id, actualUser.user.id)
            destroyCard(fightAgro, enemyUser.user.id)
        } else {
            changeLife(fightAgro, newLife)
        }

        let cardsF = document.querySelectorAll('.selectedFightCard')
        for(let c of cardsF) {
            c.classList.remove('selectedFightCard')
        }

        selectedAgro = null
        selectedFight = null
    }

    io.on('updateLife', (data) => {
        let actualBar = document.querySelector('.HP_' + data.idUser + "_" + data.card.id)
        let newHP = data.card.life * 100 / data.card.maxLife + "%"
        actualBar.style.width = newHP
        updateCardPlayground(data.idUser, data.card.id, data.card)
    })

    function changeLife(card, newLife) {
        io.emit('changeCardLife', {game: game, idUser: enemyUser.user.id, card: card, newLife: newLife})
    }

    function enemyDamageUser(damage, idUser, idAttacker) {
        io.emit('sendDamageUser', {game: game, idUser: idUser, idAttacker: idAttacker, user : $user, damage: damage * -1})
    }

    io.on('endGame', (data) => {
        game.turn = data.turn
        $user.mmr = data.user.mmr
        $user.game_win = data.user.game_win
        $user.game_lose = data.user.game_lose
        goto("/")
    })

    io.on('sendDamageUser', (data) => {
        updatePlaygroundUserLife(data.user)
        updateLifeUser(data.user)
    })

    function destroyCard(card, idUser) {
        io.emit('destroyCard', {game: game, idUser: idUser, card: card})
    }

    io.on('destroyCard', (data) => {
        let card = getCardUserPlayground(data.idUser, data.card.id)
        card.card = null
        updatePlayground(data.idUser, data.playground)
        deleteCardPlayground(data.idUser, data.card.id)
        deleteCardFromBoard(data.idUser, data.idBoard)
    })

    function changeTurn() {
        if(!myTurn())
            return

        io.emit('changeTurn', {game: game, user1: actualUser.user.id, user2: enemyUser.user.id})
    }

    io.on('changeTurn', newGame => {
        game.turn = newGame.turn
    })

    function checkPose() {
        if(!myTurn())
            return

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

                img.addEventListener('click', () => {
                    selectOneCard(`.CARD_FIGHT_${img.id}`, ".boardCard", "selectedFightCard")
                    selectedFight = img.id
                })

                img.classList.add('CardTrail')
                img.classList.add('cardRemove')

                setTimeout(() => {
                    img.classList.remove('cardRemove')
                },10)

                let HpMaxCard = document.createElement("div")
                HpMaxCard.classList.add('MaxHpCard')
                let HpCard = document.createElement("div")
                HpCard.classList.add('HpCard')
                HpCard.classList.add('HP_' + actualUser.user.id + "_" + selectedCard.id)
                actualFrame.card.maxLife = actualFrame.card.life
                
                selectedFrame.appendChild(img)
                HpMaxCard.appendChild(HpCard)
                selectedFrame.appendChild(HpMaxCard)

                io.emit('updateUserPlayground', {
                    id: game.id,
                    modifyId: actualUser.user.id,
                    playGround: actualUser.playGround
                })

                io.emit("refreshMana", {game: game, idUser: actualUser.user.id, card: selectedCard})

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
            array.push({
                id: attr + "_" + i,
                div: div,
                empty: true
            })
        }
    }

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

            <div class="curveContainer">
                {#if actualUser.deck != undefined}
                    {#each actualUser.deck[0].listCards as card}
                        <img
                            alt="{card.path}" 
                            src="http://51.210.104.99:8001/getImage/{card.path}" 
                            class="curveCard MyCard mr-4 CARD_{card.id} {(game[actualUser.user.id].mana >= card.cost) ? '' : 'noMana'}"
                            on:click={() =>{
                                if(game[actualUser.user.id].mana >= card.cost)
                                    setSelectedCard(card)
                            }}
                        >
                    {/each}
                {/if}
            </div>

            <div class="flex flex-row MyDeck mt-1">
            <!-- <div class="MyHand p-4 pl-12 pr-16 flex flex-row">
                {#if actualUser.deck != undefined}
                    {#each actualUser.deck[0].listCards as card}
                        <img 
                            alt="{card.path}" 
                            src="http://51.210.104.99:8001/getImage/{card.path}" 
                            class="MyCard mr-4 CARD_{card.id} {(game[actualUser.user.id].mana >= card.cost) ? '' : 'noMana'}"
                            on:click={() =>{
                                if(game[actualUser.user.id].mana >= card.cost)
                                    setSelectedCard(card)
                            }}
                        >
                    {/each}
                {/if}
            </div> -->
        </div>
    </div>
    <div class="flex-1 rightContainer m-1">
        {#if game.turn && actualUser.user && game.turn == actualUser.user.id}
            <div class="changeTurn" on:click={changeTurn}>
                <img src="static/assets/switch.svg" alt="" class="itemmenu">
            </div>
        {/if}
        <div class="flex flex-col h-full">
            <!-- 
                ENNEMY
            -->
            <div class="EnemyInfo flex-1 flex flex-col">
                <div class="titleRightContainer">
                    <div class="{(game.turn && enemyUser.user && game.turn == enemyUser.user.id) ? 'turnDiv' : ''}">
                        {enemyUser.user?.username || ""} 
                        {#if game.turn && enemyUser.user && game.turn == enemyUser.user.id}
                            ({timer})
                        {/if}
                    </div>
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
                    <div class="{(game.turn && actualUser.user && game.turn == actualUser.user.id) ? 'turnDiv' : ''}">
                        {actualUser.user?.username || ""}
                        {#if game.turn && actualUser.user && game.turn == actualUser.user.id}
                            ({timer})
                        {/if}
                    </div>
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