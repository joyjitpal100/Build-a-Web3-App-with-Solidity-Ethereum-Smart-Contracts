import React, {useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  /*
  Create a variable here that holds the contract address after you deploy!
  */
  const contractAddress = "0x2f7b464A1f3B01De37754240116e9E58a9Fec8f4";
  const contractABI =abi.abi;
  

  const checkIfWalletIsConected = async () => {
    try{
      const { ethereum  } = window;
      if (!ethereum )
      console.log("Make sure you have metamask!")
      else 
      console.log("We have the ethereum object", ethereum )

      //check if we have an authorized account

      const accounts = await ethereum.request({ method:"eth_accounts" });
      if(accounts.length!==0){
        const account = accounts[0];
        console.log("Found an authorised account: ", account)
        setCurrentAccount(account);
      }
      else {
        console.log("NO authorised account found");
      }
    }
    catch(e){
      console.log(e);
    }
    
  }

  /*Implement you wallet connect method here*/



  const connectWallet = async () => {
    try{
      const { ethereum  } = window;
      if (!ethereum ){
      alert("Get Metamask");
      return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Accounts: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      
          }
    catch(e){
       console.log(e);
    }
  }


const wave = async () => {
try{
      const { ethereum  } = window;
      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count", count.toNumber());
        /*
        Execute the actual wave from your smart contract
        */

        const waveTxn = await  wavePortalContract.wave();
        console.log("Mining..."+ waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined..."+waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count..."+ count.toNumber());

      }
      else{
        console.log("Etherium object doesnt exist!!!");
      }
}
 catch(e){
       console.log(e);
    }
}
  



  useEffect(() => {
    checkIfWalletIsConected();
  },[])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {/*
        *If there is no current account render this button
        *
        */}

        {
          !currentAccount && (
            <button className = "waveButton" onClick={connectWallet}>
            Connect Wallet
            </button>
          )}


      </div>
    </div>
  );
}
