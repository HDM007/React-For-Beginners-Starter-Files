import React from 'react'
import PropTypes from "prop-types";
import Header from './Header';
import Order from "./Order"
import Inventory from "./Inventory"
import sampleFishes from "../sample-fishes"
import Fish from "./Fish"
import base from '../base'

class App extends React.Component{
    state = {
        fishes: {},
        order: {}
    };

    static propTypes = {
        match: PropTypes.object
    }

    componentDidMount(){
        const { params } = this.props.match;
        // first reinstate our localStorage
        const localStorageRef = localStorage.getItem(params.storeID);
        if(localStorageRef){
            this.setState({ order: JSON.parse(localStorageRef)})
        }

        this.ref = base.syncState(`${params.storeID}/fishes`, {
            context: this,
            state: "fishes"
        });
    }

    componentDidUpdate() {
        localStorage.setItem(this.props.match.params.storeID, JSON.stringify(this.state.order));
    }

    componentWillUnmount(){
        base.removeBinding(this.ref)
    }
    
    addFish = fish => {
        //take a copy of state, don't mutate it.
        const fishes = { ...this.state.fishes };
        //add our new fish to that fishes variable.
        fishes[`fish${Date.now()}`] = fish;
        //set new fishes object to state
        this.setState({ fishes });

    };

    updateFish = (key, updatedFish) => {
        //1 take copy of current state
        const fishes = {...this.state.fishes};
        //2 update that state
        fishes[key] = updatedFish;
        //3 set to state
        this.setState({fishes})
    }

    deleteFish = (key) => {
        //1. take copy of current state
        const fishes = {...this.state.fishes};
        //2 update the state
        fishes[key] = null;
        //3 update state
        this.setState({ fishes });
    };

    loadSampleFishes= () =>{
        this.setState({fishes: sampleFishes})
    };

    addToOrder = key => {
        //take a copy of state
        const order = {...this.state.order};
        //Add to or update order
        order[key] = order[key] + 1 || 1;
        this.setState({ order });
    };

    removeFromOrder = key => {
        //take a copy of state
        const order = {...this.state.order};
        //Remove from order
        delete order[key];
        this.setState({ order });
    };

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="fishes">
                        {Object.keys(this.state.fishes).map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
                <Inventory addFish={this.addFish} loadSampleFishes={this.loadSampleFishes} fishes={this.state.fishes} updateFish={this.updateFish} deleteFish={this.deleteFish} storeID={this.props.match.params.storeID}/>
            </div>
        )
    }
}

export default App;