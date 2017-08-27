import React from "react";
import { inject } from "mobx-react";

@inject("gameStore")
export default class SuccessMessage extends React.Component {

    handleRestart = () => {
        this.props.gameStore.resetGame();
    };

    render() {
        return (
            <div className="container">
                <h1>Victory!</h1>
                <h2>Score: {this.props.gameStore.attempts}</h2>
                <h2>Best: {this.props.gameStore.best}</h2>
                <button className="restart" onClick={this.handleRestart}>Restart</button>
            </div>
        )
    }

}