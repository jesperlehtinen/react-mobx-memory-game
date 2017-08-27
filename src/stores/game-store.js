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

export default class GameStore {
    @observable cards = [];
    @observable flippedCards = [];
    @observable matchedCards = [];
    @observable attempts = 0;
    @observable best = Number.MAX_SAFE_INTEGER;
    @observable done = false;

    constructor() {
        this.cards = this.duplicatedAndShuffledCards();
    }

    @action flip(card) {
        card.flip();
        this.flippedCards.push(card);

        if(this.flippedCards.length === 2) {
            this.increaseAttempts();
            if(this.flippedCards[0].image === this.flippedCards[1].image) {
                this.handleMatch();
            } else {
                this.handleMisMatch();
            }
        }
    }

    @action setBest(best) {
        this.best = best;
    }

    @action setDone(done) {
        this.done = done;
    }

    @action resetGame() {
        debugger;
        this.cards = this.duplicatedAndShuffledCards();
        this.flippedCards = [];
        this.matchedCards = [];
        this.attempts = 0;
        this.setDone(false);
    }

    @action handleMatch() {
        this.flippedCards.forEach(card => {
            card.matched();
            this.matchedCards.push(card);
        });
        this.flippedCards = [];
        this.checkGameDone();
    }

    @action handleMisMatch() {
        setTimeout(() => {
            this.flippedCards.forEach(card => card.flip());
            this.flippedCards = [];
        }, 800);
    }

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

    duplicatedAndShuffledCards() {
        return shuffle([...images, ...images]).map(image => (new Card(image)))
    }

}