import React, { Component, Fragment } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import { Button, TextField, AppBar, Toolbar, Typography } from "@material-ui/core";

import "./App.css";

class App extends Component {
  state = { 
    loaded: false, 
    resultObject: null, 
    candidates: {
      c0: {
        name: "jay_0",
        noOfVotes: 0
      },
      c1: {
        name: "jay_1",
        noOfVotes: 0
      },
      c2: {
        name: "jay_2",
        noOfVotes: 0
      }
    },
    name: "",
    step: 0
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.VotingContractInstance = new this.web3.eth.Contract(
        VotingContract.abi,
        VotingContract.networks[this.networkId] && VotingContract.networks[this.networkId].address,
      );

      let noOfVotesOfCandidate_0,noOfVotesOfCandidate_1,noOfVotesOfCandidate_2;
      noOfVotesOfCandidate_0 = await this.VotingContractInstance.methods.votesOfJay_0().call();
      noOfVotesOfCandidate_1 = await this.VotingContractInstance.methods.votesOfJay_1().call();
      noOfVotesOfCandidate_2 = await this.VotingContractInstance.methods.votesOfJay_2().call();
      this.setState(prevState => {
        prevState.loaded = true; 
        prevState.candidates.c0.noOfVotes= noOfVotesOfCandidate_0;
        prevState.candidates.c1.noOfVotes= noOfVotesOfCandidate_1;
        prevState.candidates.c2.noOfVotes= noOfVotesOfCandidate_2;
        return prevState;
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleVote = async (_name) => {
    const name = _name
    console.log(name);
    console.log(this.accounts[0]);
    let result;
    let noOfVotesOfCandidate;
    if(name==="jay_0") {
      result = await this.VotingContractInstance.methods.voteJay_0(this.state.name).send({from: this.accounts[0]});
      console.log(result);
      noOfVotesOfCandidate = await this.VotingContractInstance.methods.votesOfJay_0().call();
      console.log(noOfVotesOfCandidate);
      this.setState(prevState => {
        prevState.resultObject = result; 
        prevState.candidates.c0.noOfVotes= noOfVotesOfCandidate;
        prevState.step = 2;
        return prevState;
      });
    }
    else if(name==="jay_1") {
      result = await this.VotingContractInstance.methods.voteJay_1(this.state.name).send({from: this.accounts[0]});
      noOfVotesOfCandidate = await this.VotingContractInstance.methods.votesOfJay_1().call();
      this.setState(prevState => {
        prevState.resultObject = result; 
        prevState.candidates.c1.noOfVotes= noOfVotesOfCandidate;
        prevState.step = 2;
        return prevState;
      });
    }
    else if(name==="jay_2") {
      result = await this.VotingContractInstance.methods.voteJay_2(this.state.name).send({from: this.accounts[0]});
      noOfVotesOfCandidate = await this.VotingContractInstance.methods.votesOfJay_2().call();
      this.setState(prevState => {
        prevState.resultObject = result; 
        prevState.candidates.c2.noOfVotes= noOfVotesOfCandidate;
        prevState.step = 2;
        return prevState;
      });
    }
    alert("Vote given to "+this.state.resultObject.events.voteTransfered.returnValues.to);
  }

  handleInputChange = async (event) => {
    const value = event.target.value;
    this.setState({name: value});
    console.log(this.state.name);
  }

  handleValidation = async () => {
    const value = this.state.name;
    if(!/^[0-9]+$/.test(value) || value.length !== 12){
      alert("Please check your AADHAR NO. (12 digits only numeric characters)");
    }
    else {
      const res = await this.VotingContractInstance.methods.checkVote(value).call();
      if(res) {
        alert("This person has already voted");
      }
      else {
        alert("Valid Aadhar No.");
        this.setState({step: 1});
      }
    }
  }

  checkVote = async (_name) => {
    const z = _name;
    if(!/^[0-9]+$/.test(z) || z.length !== 12){
      alert("Please check your AADHAR NO. (12 digits only numeric characters)");
    }
    else {
      const value = await this.VotingContractInstance.methods.checkVote(_name).call()
      value ? alert("This person has already voted!") : alert("This person is yet to vote!");
    }
  }

  givenTo = async (_name) => {
    const z = _name;
    if(!/^[0-9]+$/.test(z) || z.length !== 12){
      alert("Please check your AADHAR NO. (12 digits only numeric characters)");
    }
    else {
      const value = await this.VotingContractInstance.methods.optedCandidate(_name).call()
      console.log(value);
      value ? alert(`This person has voted for: ${value}`) : alert("This person is yet to vote!");
    }
  }

  goBack = () => {
    this.setState({step: 0, name: ""});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let data;
    if(this.state.step === 0) {
        data =  <Fragment>
                  <TextField 
                    id="outlined-basic" 
                    label="Enter Your Aadhar No." 
                    variant="outlined" 
                    placeholder="" 
                    onChange={this.handleInputChange} 
                    value={this.state.name} 
                  />
                  <br></br>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={this.handleValidation}>Validate And Move Further</Button>
                  <br></br>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={() => {this.checkVote(this.state.name)}}>Voted Or Not</Button>
                  <br></br>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={() => {this.givenTo(this.state.name)}}>Voted For</Button>
                  
            </Fragment>
    }

    if(this.state.step === 1) {
      data = <Fragment>
                <h2>Select Candidate</h2>
                  <Button variant="contained" color="primary" onClick={() => {this.handleVote("jay_0")}}>Jay_0</Button>
                  <br></br>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={() => {this.handleVote("jay_1")}}>Jay_1</Button>
                  <br></br>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={() => {this.handleVote("jay_2")}}>Jay_2</Button>
                  <br></br>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={this.goBack}>Back to step 1</Button>
            </Fragment>
    }

    if(this.state.step === 2) {
      data = <Fragment>
                  <Button variant="contained" color="primary" onClick={this.goBack}>Back to step 1</Button>
          </Fragment>
    }
    return (
      <div className="App">
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            E-Voting based on ETHEREUM BLOCKCHAIN
          </Typography>
        </Toolbar>
      </AppBar>
        <h1>Voting Is Important!</h1>
        <p>Caste Your Vote Wisely.</p>
        {data}
        <h2>Votes for {this.state.candidates.c0.name} : {this.state.candidates.c0.noOfVotes} votes</h2>
        <h2>Votes for {this.state.candidates.c1.name} : {this.state.candidates.c1.noOfVotes} votes</h2>
        <h2>Votes for {this.state.candidates.c2.name} : {this.state.candidates.c2.noOfVotes} votes</h2>
      </div>
    );
  }
}
export default App;
// 123456789123