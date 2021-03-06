import { observable, action } from "mobx";
import shuffle from "../shuffle";
import uuid from "uuid/v4";

const images = [
    "/images/dog.jpg",
    "/images/cat.jpg",
    "/images/bunny.jpg",
    "/images/horse.jpg",
    "/images/duck.jpg",
    "/images/seal.jpg",
];


/**
 * Model for a Card
 */
class Card {
    id;
    image;
    @observable flipped = false;
    @observable match = false;

    constructor(image) {
        this.id = uuid();
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
    @action flip = card => {
        if(!this.blocked) {
            // don't allow multiple flips for a card while it's up
            if(this.flippedCards.length === 1 && this.flippedCards[0].id === card.id) {
                return;
            }
            // don't allow flipping already matched cards
            if(card.match) {
                return;
            }

            card.flip();
            this.addToFlipped(card);

            // if we have two cards up, check for match
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
    };

    /**
     * Reset the game to initial state
     */
    @action resetGame = () => {
        this.cards = this.duplicatedAndShuffledCards();
        this.flippedCards = [];
        this.matchedCards = [];
        this.attempts = 0;
        this.setDone(false);
    };

    /**
     * Handle a match - add the cards to matched cards, reset flipped cards
     */
    @action handleMatch = () => {
        this.flippedCards.forEach(card => {
            card.matched();
            this.addToMatched(card);
        });
        this.flippedCards = [];
        this.checkGameDone();
        this.blocked = false;
    };

    /**
     * Handle mismatch - flip all flipped cards back over again
     */
    @action handleMisMatch = () => {
        setTimeout(() => {
            this.flippedCards.forEach(card => card.flip());
            this.flippedCards = [];
            this.blocked = false;
        }, 750);
    };

    /**
     * Check if all cards are matched and the game is over
     */
    @action checkGameDone = () => {
        if (this.matchedCards.length === 12) {
            setTimeout(() => {
                if(this.attempts < this.best) {
                    this.setBest(this.attempts);
                }
                this.setDone(true);
            }, 1000);
        }
    };

    @action increaseAttempts = () => this.attempts = this.attempts + 1;

    @action setBest = best => this.best = best;

    @action setDone = done => this.done = done;

    @action addToFlipped = card => this.flippedCards.push(card);

    @action addToMatched = card => this.matchedCards.push(card);

    /**
     * Returns an array with Cards mapped with image (2 of each)
     */
    duplicatedAndShuffledCards = () => shuffle([...images, ...images]).map(image => (new Card(image)));

}