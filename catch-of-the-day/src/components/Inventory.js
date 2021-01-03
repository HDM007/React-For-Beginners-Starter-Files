import React from 'react';
import PropTypes from "prop-types";
import firebase from 'firebase';
import AddFishForm from './AddFishForm';
import EditFishForm from  './EditFishForm'
import Login from './Login';
import base, { firebaseApp } from "../base";


class Inventory extends React.Component{
    static propTypes = {
        fishes: PropTypes.object,
        updateFish: PropTypes.func,
        deleteFish: PropTypes.func,
        loadSampleFishes: PropTypes.func
    };

    state = {
        uid: null,
        owner: null
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user =>{
            if(user){
                this.authHandler({user})
            }
        })
    }

    authHandler = async (authData) => {
        //look up current store in firebase, and claim if no owner.
        const store = await base.fetch(this.props.storeID, {context: this});
        console.log(store)
        if (!store.owner){
            //save it as our own
            await base.post(`${this.props.storeID}/owner`, {data: authData.user.uid
            });
        }
        this.setState({
            uid: authData.user.uid,
            owner: store.owner || authData.user.uid
        });

        console.log(authData)
    }

    authenticate = provider => {
        const authProvider = new firebase.auth[`${provider}AuthProvider`]();
        firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
    }

    logout = async () => {
        console.log("Logging out!");
        await firebase.auth().signOut();
        this.setState({uid: null});

    }

    render() {
        const logout = <button onClick={this.logout}>Log Out!</button>;
        // Check if logged in
        if(!this.state.uid){
            return <Login authenticate={this.authenticate}/>
        }
        //Check ownership
        if(this.state.uid !== this.state.owner){
            return <div>
                <h2>Inventory Login</h2>
                <p>Sorry, you're not the owner.</p>
                {logout}
            </div>
        }
        //Finally, they must be owner, so just render the below inventory.
        return (
            <div className="inventory">
                <h2>Inventory!!</h2>
                {logout}
                {Object.keys(this.props.fishes).map(key => <EditFishForm key={key} index={key} fish={this.props.fishes[key]} updateFish={this.props.updateFish} deleteFish={this.props.deleteFish}/>)}
                <AddFishForm addFish={this.props.addFish}/>
                <button onClick={this.props.loadSampleFishes} >Load Sample Fishes</button>
            </div>
        )
    }
}

export default Inventory;