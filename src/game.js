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
            flippedCards: []
        };
    };

    duplicatedAndShuffledCards = () => (
        shuffle([...images, ...images])
    );

    handleCardClick = (flipped, unflipCallback) => {
        const card = {image: flipped, callback: unflipCallback};
        this.setState({flippedCards: [...this.state.flippedCards, card]}, this.handleFlippedCardChange);
    };

    handleFlippedCardChange = () => {
        if(this.state.flippedCards.length === 2) {
            setTimeout(() => {
                this.state.flippedCards.forEach(card => {
                    card.callback();
                });
                this.setState({flippedCards: []});
            }, 1000);
        }
    };

    render() {
        return (
            <div>
                {this.state.cards.map((card, index) => (
                    <Card canFlip={this.state.flippedCards.length < 2}
                          image={card}
                          onFlip={this.handleCardClick}
                          key={index}/>
                ))}
            </div>
        )
    }

}