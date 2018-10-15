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

function isSearched(searchTerm) {
  return function (item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

// const { value, onChange, children } = props;
const Search = ( { value, onChange, children }) => {
  return (
    <form>
      {children}
      <input type="text"
             value={value}
             onChange={onChange}
      />
    </form>
  );
}

const Table = ({ list, pattern, onDismiss }) => {
  const largeColumn = {
    width: '40%',
  };

  const midColumn = {
    width: '30%',
  };

  const smallColumn = {
    width: '10%',
  };
  return (
    <div className="table">
      {
        list.filter(isSearched(pattern)).map( item =>  {
          return <div key={item.objectID} className="table-row">
                   <span style={largeColumn}>
                     <a href={item.url}>{item.title}</a>
                   </span>
                   <span style={midColumn}>
                     {item.author}
                   </span>
                   <span style={smallColumn}>
                     {item.num_comments}
                   </span>
                   <span style={smallColumn}>
                     {item.points}
                   </span>
              <span>
                <Button onClick={()=> onDismiss(item.objectID)}>
                  Dismiss
                </Button>
              </span>
            </div>;
        })
      }
    </div>
  );
}

const Button = ({onClick, className = '', children}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  )
}

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list,
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({result})
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onDismiss(id) {
    const isNotID = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotID);
    this.setState({
      result: {...this.state.result, hits: updatedList}
    });
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  render() {
    const { searchTerm, result } = this.state;
    if (!result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        </div>
      </div>
    );
  }
}

export default App;
