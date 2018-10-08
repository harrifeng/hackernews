import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    var helloworld = "Weleome to the Road to learn React"
    return (
      <div className="App">
        <h2>{helloworld}</h2>
      </div>
    );
  }
}

export default App;
