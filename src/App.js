import React, { Component } from 'react';
// import axios from 'axios';
import ViewSearchID from './components/ViewSearchID'
import ViewListWrapper from './components/ViewListWrapper'
import ApiDefault from './components/ApiDefault'
import './css/App.css';

class App extends Component {
  state = {
    input: "",
    summoner : {},
    match : {},
    league : {}
  };
  getLOLData = async () => {
    if(this.state.input.length <= 0) {
      alert("ID를 입력해주세요")
      return;
    }
    try {
      const summoner = await ApiDefault.instance.get(`/summoner/v4/summoners/by-name/${this.state.input}?api_key=${ApiDefault.key}`);
      const match    = await ApiDefault.instance.get(`/match/v4/matchlists/by-account/${summoner.data.accountId}?api_key=${ApiDefault.key}`);
      const league   = await ApiDefault.instance.get(`/league/v4/positions/by-summoner/${summoner.data.id}?api_key=${ApiDefault.key}`); 
      if( league.data[0] === undefined ){
        alert('언랭은 검색못해요...');
        return;
      } 

      this.setState({
        summoner: summoner.data,
        match : match.data,
        league : league.data[0]
      })
    } catch (error) {
      console.error('Data 없음',error);
    }
  }
  getPreferData = (data) => {
    let champ = [], 
        playChamp = [], 
        playChampCnt = [],
        preferData = {
            preferChamp : '',
            preferLane : '',
            champ : [],
            lane: [
                {
                  lane : "SUPPORT", 
                  playCount: 0, 
                  style : {
                    backgroundImage: `url('http://opgg-static.akamaized.net/assets/site.png')`,
                    backgroundPosition: "-70px -2794px",
                  }
                },
                {
                  lane : "TOP", 
                  playCount: 0,
                  style : {
                    backgroundImage: `url('http://opgg-static.akamaized.net/assets/site.png')`,
                    backgroundPosition: "-80px -2872px",
                  }
                },
                {
                  lane : "MID", 
                  playCount: 0,
                  style : {
                    backgroundImage: `url('http://opgg-static.akamaized.net/assets/site.png')`,
                    backgroundPosition: "-80px -2719px",
                  }
                },
                {
                  lane : "JUNGLE", 
                  playCount: 0,
                  style : {
                    backgroundImage: `url('http://opgg-static.akamaized.net/assets/site.png')`,
                    backgroundPosition: "-83px -2640px",
                  }
                },
                {
                  lane : "BOTTOM", 
                  playCount: 0,
                  style : {
                    backgroundImage: `url('http://opgg-static.akamaized.net/assets/site.png')`,
                    backgroundPosition: "-80px -2564px",
                  }
                },
                { lane : "NONE", playCount: 0 },
            ]
        };
    data.map((item) => {
        if(item.role === "DUO_SUPPORT"){
            preferData.lane[0].playCount ++;
        }else{
            switch (item.lane){ 
                case "TOP" : preferData.lane[1].playCount ++;
                break; 
                case "MID" : preferData.lane[2].playCount ++;
                break; 
                case "JUNGLE" : preferData.lane[3].playCount ++;
                break; 
                case "BOTTOM" : preferData.lane[4].playCount ++;
                break; 
                case "NONE" : preferData.lane[5].playCount ++;
                break; 
                default : return preferData.lane; 
            }
        }
        return champ.push(item.champion);
    })
    playChamp = champ.filter((item, pos) => champ.indexOf(item) === pos) 
    playChamp.map((item) => playChampCnt.push(champ.filter((items) => item === items)))

    preferData.champ =  playChampCnt;
    preferData.preferChamp = preferData.champ.reduce((prev, current) => (prev.length > current.length) ? prev : current)
    preferData.preferLane = preferData.lane.reduce((prev, current) => (prev.playCount > current.playCount) ? prev : current)
    return preferData;
}
  handleChange = (e) => {
    this.setState({
      input: e.target.value,
    });
  }
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.getLOLData();
    }
  }
  render() {
    const { summoner, league, match } = this.state
    const { handleChange, handleKeyPress, getLOLData, getPreferData } = this
    const ListWrapper = summoner.id === undefined ? null : <ViewListWrapper summoner={summoner} league={league} match={match} getPreferData={getPreferData}/>;
    
    return (
      <div className="App">
        <ViewSearchID 
          handleChange={handleChange}
          handleKeyPress={handleKeyPress}
          getLOLData={getLOLData}
        />
        {ListWrapper}
      </div>
    );
  }
}

export default App;