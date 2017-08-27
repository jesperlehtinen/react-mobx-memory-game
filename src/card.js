import React from "react";
import './card.css';
import { inject, observer } from "mobx-react";

@inject("gameStore") @observer
export default class Card extends React.Component {

    handleCardClick = () => {
        this.props.gameStore.flip(this.props.card);
    };

    render() {
        return (
            <div className={`card ${this.props.card.match ? "match" : ""}`} onClick={this.handleCardClick}>
                <div className={`image ${this.props.card.flipped ? "flipped" : ""}`}
                     style={{backgroundImage: `url(${this.props.card.image}`}}/>
            </div>
        )
    };

}