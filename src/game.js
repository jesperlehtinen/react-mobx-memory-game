import React from "react";
import Card from "./card";
import './game.css';
import SuccessMessage from "./success-message";
import { inject, observer } from "mobx-react";

@inject("gameStore") @observer
export default class Game extends React.Component {

    render() {
        if (this.props.gameStore.done) {
            return (
                <SuccessMessage />
            )
        } else {
            const { cards } = this.props.gameStore;
            return (
                <div>
                    {cards.map((card, index) =>
                        (<Card card={card} key={index}/>)
                    )}
                </div>
            )
        }
    }

}
