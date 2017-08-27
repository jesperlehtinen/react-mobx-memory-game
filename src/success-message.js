import React from "react";

export default class SuccessMessage extends React.Component {

    render() {
        return (
            <div className="container">
                <h1>Victory!</h1>
                <h2>Score: {this.props.attempts}</h2>
                <h2>Best: {this.props.best}</h2>
                <button className="restart" onClick={this.props.restartGame}>Restart</button>
            </div>
        )
    }

}