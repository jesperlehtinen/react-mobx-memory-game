import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Game from "./game";
import { Provider } from "mobx-react";
import GameStore from "./stores/game-store";

const stores = {
    gameStore: new GameStore()
};

const App = () =>
    <Provider {...stores}>
        <Game/>
    </Provider>;

ReactDOM.render(<App/>, document.getElementById('root'));