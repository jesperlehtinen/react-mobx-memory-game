import React from "react";
import Card from "./card"
import './game.css';
import shuffle from "./shuffle"

const images = [
    "/images/dog-1.jpg",
    "/images/dog-2.jpg",
    "/images/dog-3.jpg",
    "/images/dog-4.jpg",
    "/images/dog-5.jpg",
    "/images/dog-6.jpg",
];

export default class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: this.duplicatedAndShuffledCards(),
            flippedCards: [],
            matchedCards: [],
            done: false
        };
    };

    duplicatedAndShuffledCards = () => (
        shuffle([...images, ...images])
    );

    handleCardClick = (flipped, unflipCallback) => {
        if (this.state.matchedCards.some((photo) => flipped === photo.image)) {
            return;
        }

        this.setState({
            flippedCards: [...this.state.flippedCards, {
                image: flipped,
                callback: unflipCallback
            }]
        }, this.handleFlippedCardChange);
    };

    handleFlippedCardChange = () => {
        if (this.state.flippedCards.length === 2) {
            if (this.state.flippedCards[0].image === this.state.flippedCards[1].image) {
                this.handleFlippedMatch();
            } else {
                this.handleFlippedMisMatch();
            }
        }
    };

    handleFlippedMatch = () => {
        this.setState({matchedCards: [...this.state.matchedCards, ...this.state.flippedCards], flippedCards: []}, this.checkGameDone);
    };

    handleFlippedMisMatch = () => {
        setTimeout(() => {
            this.state.flippedCards.forEach(card => {
                card.callback();
            });
            this.setState({flippedCards: []});
        }, 800);
    };

    checkGameDone = () => {
        if (this.state.matchedCards.length === 12) {
            setTimeout(() => {
                this.setState({done: true});
            }, 1000);
        }
    };

    restartGame = () => {
        this.setState({
            cards: this.duplicatedAndShuffledCards(),
            flippedCards: [],
            matchedCards: [],
            done: false
        });
    };

    render() {
        if (this.state.done) {
            return (
                <div className="container">
                    <h1 className="victory">Victory!</h1>
                    <button className="restart" onClick={this.restartGame}>Restart</button>
                </div>
            )
        } else {
            return (
                <div>
                    {this.state.cards.map((card, index) => (
                        <Card image={card}
                              canFlip={this.state.flippedCards.length < 2}
                              onFlip={this.handleCardClick}
                              key={index}/>
                    ))}
                </div>
            )
        }
    }

}
