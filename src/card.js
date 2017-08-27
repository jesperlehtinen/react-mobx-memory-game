import React from "react";
import './card.css';
import { inject } from "mobx-react";

@inject("gameStore")
export default class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flipped: false,
            match: false
        }
    };

    handleClick = () => {
        if (this.props.canFlip) {
            this.setState({flipped: true});
            this.props.onFlip(this.props.image, this.unflip, this.setMatched);
        }
    };

    unflip = () => {
        this.setState({flipped: false});
    };

    setMatched = () => {
        this.setState({match: true});
    };

    render() {
        return (
            <div className={`card ${this.state.match ? "match" : ""}`} onClick={this.handleClick}>
                <div className={`image ${this.state.flipped ? "flipped" : ""}`}
                     style={{backgroundImage: `url(${this.props.image}`}}/>
            </div>
        )
    };

}