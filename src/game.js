import React from "react";
import Card from "./card";
import './game.css';
import SuccessMessage from "./success-message";
import { inject } from "mobx-react";

@inject("gameStore")
export default class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            flippedCards: [],
            matchedCards: [],
            done: false,
            attempts: 0,
            best: Number.MAX_SAFE_INTEGER
        };
    };

    handleCardClick = (flipped, unflipCallback, matchCallback) => {
        if (this.state.matchedCards.some((photo) => flipped === photo.image)) {
            return;
        }

        this.setState({
            flippedCards: [...this.state.flippedCards, {
                image: flipped,
                unflipCallback: unflipCallback,
                matchCallback: matchCallback
            }]
        }, this.handleFlippedCardChange);
    };

    handleFlippedCardChange = () => {
        if (this.state.flippedCards.length === 2) {
            this.setState({attempts: this.state.attempts + 1});
            if (this.state.flippedCards[0].image === this.state.flippedCards[1].image) {
                this.handleFlippedMatch();
            } else {
                this.handleFlippedMisMatch();
            }
        }
    };

    handleFlippedMatch = () => {
        this.state.flippedCards.forEach(card => {
            card.matchCallback();
        });
        this.setState({matchedCards: [...this.state.matchedCards, ...this.state.flippedCards], flippedCards: []}, this.checkGameDone);
    };

    handleFlippedMisMatch = () => {
        setTimeout(() => {
            this.state.flippedCards.forEach(card => {
                card.unflipCallback();
            });
            this.setState({flippedCards: []});
        }, 800);
    };

    checkGameDone = () => {
        if (this.state.matchedCards.length === 12) {
            setTimeout(() => {
                if(this.state.attempts < this.state.best) {
                    this.setState({best: this.state.attempts});
                }
                this.setState({done: true});
            }, 1000);
        }
    };

    restartGame = () => {
        const { cards } = this.props.gameStore;
        this.setState({
            cards: cards,
            flippedCards: [],
            matchedCards: [],
            done: false,
            attempts: 0
        });
    };

    render() {
        if (this.state.done) {
            return (
                <SuccessMessage attempts={this.state.attempts} best={this.state.best} restartGame={this.restartGame}/>
            )
        } else {
            const { cards } = this.props.gameStore;
            return (
                <div>
                    { cards.map((card, index) => (
                        <Card image={card}
                              canFlip={this.state.flippedCards.length < 2}
                              onFlip={this.handleCardClick}
                              key={index}/>
                    )) }
                </div>
            )
        }
    }

}
