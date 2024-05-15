const playButton = document.querySelector(".play")
const moneyDsiplay = document.querySelectorAll("h2")
const betAmount = document.getElementById("betAmount")
const points = document.querySelectorAll("h5")
const playerCardsContainer = document.querySelector(".playerCards")
const dealerCardsContainer = document.querySelector(".dealerCards")
const firstPlayerCard = document.querySelectorAll(".cardBox")
const drawCardButton = document.querySelector(".drawCard")
const stopButton = document.querySelector(".stop")
const gameTable = document.querySelector(".gameTable")
const chooseBet = document.querySelector(".chooseBet")

const deckId = "z4fvz6efd16a"
let moneyAmount = JSON.parse(localStorage.getItem("money")) ? JSON.parse(localStorage.getItem("money")) : 1000
moneyDsiplay.forEach(money => money.textContent = `Money: ${moneyAmount}$`)
console.log(moneyAmount)
let playerCardArr = []
console.log(playerCardArr)
let dealerCardArr = []
console.log(dealerCardArr)
let playerPoints = 0
let dealerPoints = 0


playButton.onclick = () => {
    if (betAmount.value <= moneyAmount && betAmount.value !== "") {
        chooseBet.classList.add("d-none")
        gameTable.style.width = "100%"
        moneyAmount -= betAmount.value;
        localStorage.setItem("money", JSON.stringify(moneyAmount));
        moneyDsiplay.forEach(money => money.textContent = `Money: ${moneyAmount}$`);
        fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
            .then(res => res.json())
            .then(response => {
                console.log(response);
                playerCardArr.push(response.cards[0].value);
                dealerCardArr.push(response.cards[1].value);
                firstPlayerCard[1].style.backgroundImage = `url(${response.cards[0].image})`;

                // Handling player's card
                if (response.cards[0].value === "JACK" || response.cards[0].value === "KING" || response.cards[0].value === "QUEEN") {
                    playerPoints += 10;
                } else if (response.cards[0].value === "ACE") {
                    playerPoints += 11; // Count Ace as 11
                } else {
                    playerPoints += Number(response.cards[0].value);
                }

                points[1].textContent = `Player points: ${playerPoints}`;

                // Handling dealer's card
                if (response.cards[1].value === "JACK" || response.cards[1].value === "KING" || response.cards[1].value === "QUEEN") {
                    dealerPoints += 10;
                } else if (response.cards[1].value === "ACE") {
                    dealerPoints += 11; // Count Ace as 11
                } else {
                    dealerPoints += Number(response.cards[1].value);
                }

                firstPlayerCard[0].style.backgroundImage = `url(${response.cards[1].image})`;
                points[0].textContent = `Dealer points: ${dealerPoints}`;
            })
    } else {
        alert("You don't have enough money or the bet amount is invalid!");
    }
}

drawCardButton.onclick = () => {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(res => res.json())
        .then(response => {
            console.log(response)
            playerCardArr.push(response.cards[0].value)
            console.log(playerCardArr)
            const newCard = document.createElement("div")
            newCard.className = "cardBox"
            newCard.style.backgroundImage = `url(${response.cards[0].image})`;
            playerCardsContainer.appendChild(newCard)
            if (response.cards[0].value === "JACK" || response.cards[0].value === "KING" || response.cards[0].value === "QUEEN") {
                playerPoints += 10;
            } else if (response.cards[0].value === "ACE") {
                playerPoints += 11; // Count Ace as 11
            } else {
                playerPoints += Number(response.cards[0].value);
            }
            if (playerPoints > 21 && playerCardArr.includes("ACE")) {
                playerPoints -= 10;
            }
            points[1].textContent = `Player points: ${playerPoints}`
            if (playerPoints === 21) {
                setTimeout(() => {
                    moneyAmount += betAmount.value * 2
                    localStorage.setItem("money", JSON.stringify(moneyAmount))
                    moneyDsiplay.forEach(money => money.textContent = `Money: ${moneyAmount}$`)
                    alert("You Win!")
                    window.location.reload();
                    reshuffleCards()


                }, 1000)
            }
            if (playerPoints > 21) {
                drawCardButton.onclick = null;
                setTimeout(() => {
                    alert("You Lost!")
                    window.location.reload();
                    reshuffleCards()
                }, 1000)

            }
        })
}

stopButton.onclick = () => {
    if (dealerPoints < 17) {
        setTimeout(() => {
            fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
                .then(res => res.json())
                .then(response => {
                    console.log(response)
                    dealerCardArr.push(response.cards[0].value)
                    console.log(dealerCardArr)
                    const newCard = document.createElement("div")
                    newCard.className = "cardBox"
                    newCard.style.backgroundImage = `url(${response.cards[0].image})`;
                    dealerCardsContainer.appendChild(newCard)
                    if (response.cards[0].value === "JACK" || response.cards[0].value === "KING" || response.cards[0].value === "QUEEN") {
                        dealerPoints += 10;
                    } else if (response.cards[0].value === "ACE") {
                        dealerPoints += 11; // Count Ace as 11
                    } else {
                        dealerPoints += Number(response.cards[0].value);
                    }

                    // If dealer busts with Ace counted as 11, count it as 1
                    if (dealerPoints > 21 && dealerCardArr.includes("ACE")) {
                        dealerPoints -= 10;
                    }
                    points[0].textContent = `Dealer points: ${dealerPoints}`
                })
        }, 2000)

    } else {
        if (dealerPoints > 21 || dealerPoints < playerPoints) {
            setTimeout(() => {
                moneyAmount += betAmount.value * 2
                localStorage.setItem("money", JSON.stringify(moneyAmount))
                moneyDsiplay.forEach(money => money.textContent = `Money: ${moneyAmount}$`)
                alert("You win")
                window.location.reload();
                reshuffleCards()
            }, 1000)
        } else if (dealerPoints > playerPoints || dealerPoints === 21) {
            setTimeout(() => {
                alert("Dealer win")
                window.location.reload();
                reshuffleCards()
            }, 1000)
        } else {
            if (dealerPoints === playerPoints) {
                setTimeout(() => {
                moneyAmount += Number(betAmount.value)
                alert("DRAW - you get your bet back")
                localStorage.setItem("money", JSON.stringify(moneyAmount));
                moneyDsiplay.forEach(money => money.textContent = `Money: ${moneyAmount}$`);
                window.location.reload();
                reshuffleCards()
                }, 1000)
            }

        }
    }


    drawCardButton.onclick = null;
}

function reshuffleCards() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(res => res.json())
        .then(response => {
            console.log(response)

        })
}

