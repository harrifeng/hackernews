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
const Search = ( {
  value,
  onChange,
  onSubmit,
  children
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input type="text"
             value={value}
             onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>
  );
}

const Table = ({ list, onDismiss }) => {
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
        list.map( item =>  {
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
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list,
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    const {hits, page} = result;

    const oldHits = page !== 0
          ? this.state.result.hits
          : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      result: {hits: updatedHits, page}
    });
  }

  fetchSearchTopStories(searchTerm, page=0) {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm)
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault();
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
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
          { result &&
           <Table
            list={result.hits}
            onDismiss={this.onDismiss}
           />
          }
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page+1)}>
              More
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
