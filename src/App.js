import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list,
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(id) {
    const isNotID = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotID);
    this.setState({list: updatedList});
  }

  render() {
    return (
      <div className="App">
        {
          this.state.list.map(function(item) {
            return <div key={item.objectID}>
                     <span><a href={item.url}>{item.title}</a></span>
                     <span>{item.author}</span>
                     <span>{item.num_comments}</span>
                     <span>{item.points}</span>
                     <span>
                     </span>
                   </div>;
          })
        }
        <button
          onClick={() => {this.onDismiss(0)}}
          type="button"
        >
          Dismiss
        </button>

      </div>
    );
  }
}

export default App;
