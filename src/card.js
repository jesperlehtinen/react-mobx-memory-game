import React from "react";
import './card.css';

export default class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flipped: false
        }
    };

    handleClick = () => {
        if (this.props.canFlip) {
            this.setState({flipped: true});
            this.props.onFlip(this.props.image, this.unflip);
        }
    };

    unflip = () => {
        this.setState({flipped: false});
    };

    render() {
        return (
            <div className="card" onClick={this.handleClick}>
                <div className={`image ${this.state.flipped ? "flipped" : ""}`}
                     style={{backgroundImage: `url(${this.props.image}`}}/>
            </div>
        )
    };

}