import { observable, action } from "mobx";
import shuffle from "../shuffle";

const images = [
    "/images/dog-1.jpg",
    "/images/dog-2.jpg",
    "/images/dog-3.jpg",
    "/images/dog-4.jpg",
    "/images/dog-5.jpg",
    "/images/dog-6.jpg",
];


/**
 * Model for a Card
 */
class Card {
    image;
    @observable flipped = false;
    @observable match = false;

    constructor(image) {
        this.image = image;
    }

    @action flip() {
        this.flipped = !this.flipped;
    }

    @action matched() {
        this.match = true;
    }
}


/**
 * Store for a game - contains all game logic
 */
export default class GameStore {
    @observable cards = [];
    @observable flippedCards = [];
    @observable matchedCards = [];
    @observable attempts = 0;
    @observable best = Number.MAX_SAFE_INTEGER;
    @observable done = false;
    blocked = false;

    constructor() {
        this.cards = this.duplicatedAndShuffledCards();
    }

    /**
     * Flip a card over, and check if match with another flipped card
     * @param card
     */
    @action flip(card) {
        if(!this.blocked) {
            card.flip();
            this.flippedCards.push(card);

            if(this.flippedCards.length === 2) {
                this.blocked = true;
                this.increaseAttempts();
                if(this.flippedCards[0].image === this.flippedCards[1].image) {
                    this.handleMatch();
                } else {
                    this.handleMisMatch();
                }
            }
        }
    }

    /**
     * Reset the game to initial state
     */
    @action resetGame() {
        this.cards = this.duplicatedAndShuffledCards();
        this.flippedCards = [];
        this.matchedCards = [];
        this.attempts = 0;
        this.setDone(false);
    }

    /**
     * Handle a match - add the cards to matched cards, reset flipped cards
     */
    @action handleMatch() {
        this.flippedCards.forEach(card => {
            card.matched();
            this.matchedCards.push(card);
        });
        this.flippedCards = [];
        this.checkGameDone();
        this.blocked = false;
    }

    /**
     * Handle mismatch - flip all flipped cards back over again
     */
    @action handleMisMatch() {
        setTimeout(() => {
            this.flippedCards.forEach(card => card.flip());
            this.flippedCards = [];
            this.blocked = false;
        }, 800);
    }

    /**
     * Check if all cards are matched and the game is over
     */
    @action checkGameDone() {
        if (this.matchedCards.length === 12) {
            setTimeout(() => {
                if(this.attempts < this.best) {
                    this.setBest(this.attempts);
                }
                this.setDone(true);
            }, 1000);
        }
    }

    @action increaseAttempts() {
        this.attempts = this.attempts + 1;
    }

    @action setBest(best) {
        this.best = best;
    }

    @action setDone(done) {
        this.done = done;
    }

    /**
     * Returns an array with Cards mapped with image (2 of each)
     */
    duplicatedAndShuffledCards() {
        return shuffle([...images, ...images]).map(image => (new Card(image)))
    }

}