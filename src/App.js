import React, { Component } from 'react';
import axios from "axios";
import './App.scss';
import searchIcon from "./Assets/Icons/search-24px.svg";
import uniqid from 'uniqid';

const API_KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_API_SERVER;


export default class App extends Component {
  state = {
    results: [],
    nominations: [],
    errorSearch: null,
    searchInput: '',
  }

  handleSearch = (event) => {
    event.preventDefault();
    let searchQuery = event.target.search.value;
    if(searchQuery !== '') {
      axios.get(`${URL}${searchQuery}&apikey=${API_KEY}`)
      .then(res => {
        if(res.data.Search) {
          this.setState({
            results: res.data.Search
          })
        } else {
          this.setState({
            errorSearch: `${res.data.Error} Please try something more specific.`
          });
        }
      })
      .catch(err => {
        console.log(err)
      });
    }
  }

  handleChangeInput = (event) => {
    const searchInput = event.target.value;
    this.setState({
      searchInput: searchInput
    })

  }
  
  handleNominate = (movieID) => {
    let thisMovie = this.state.results.find(movie => movie.imdbID === movieID);
    this.setState({
      nominations: [...this.state.nominations, thisMovie]
    })
    if(this.state.nominations.length === 4) {
      window.scrollTo(0, 0);
    }
  }

  handleRemove = (movieID) => {
    this.setState({
      nominations: this.state.nominations.filter(movie => movie.imdbID !== movieID)
    })
  }


  componentDidUpdate(prevProps, prevState) {
    // this will make sure to reset the result list if there is any error from the search results
    if(prevState.errorSearch !== this.state.errorSearch && this.state.errorSearch !== null) {
      this.setState({
        results: []
      })
    }
  }


  render() {
    return (
      <div className="shoppies">
        <h1 className="shoppies__title">The Shoppies</h1>
        <div className="shoppies__header">
          <form className="shoppies__search-form" onSubmit={this.handleSearch} >
            <label className="shoppies__search-label">Movie title</label>
            <div className="shoppies__search-bar">
              <img src={searchIcon} alt="Search Icon" className="shoppies__search-icon"/>
              <input 
                type="text" 
                name="search"
                value={this.state.searchInput}
                onChange={this.handleChangeInput} 
                className="shoppies__search-input"
              />
            </div>
          </form>
        </div>

        {this.state.nominations.length === 5 && 
        <div className="shoppies__notification-banner">
          <h2 className="shoppies__notification-content">You're finished! Thank you for your participation!</h2>
        </div>}

        <div className="shoppies__body">
          <div className="shoppies__body-results">
            <h2 className="shoppies__results-title">Results {(this.state.results.length !== 0 || this.state.errorSearch !== null) ? `for "${this.state.searchInput}"` : ''}</h2>
            <ul className="shoppies__results-list">
              {(this.state.results.length === 0 && this.state.errorSearch !== null) && <p className="shoppies__results-content shoppies__result-error">{this.state.errorSearch}</p> }
              {(this.state.results.length === 0 && this.state.errorSearch === null) ? <p className="shoppies__results-content">No results</p> 
              : this.state.results.map(movie => 
              <li className="shoppies__result-item" key={uniqid()}>
                <p className="shoppies__result-content">{movie.Title} ({movie.Year})</p>
                <button 
                  className="shoppies__nominate-button" 
                  disabled={this.state.nominations.find(item => item.imdbID === movie.imdbID)
                    || this.state.nominations.length === 5 ? true : false}
                  onClick={() => this.handleNominate(movie.imdbID)}
                >
                  Nominate
                </button>
              </li>)}
            </ul>
          </div>

          <div className="shoppies__body-nominations">
            <h2 className="shoppies__nominations-list">Nominations</h2>
            <ul className="shoppies__nominations-list">
              {this.state.nominations.length === 0 ? <p className="shoppies__nominations-content">No nominations yet</p>
              : this.state.nominations.map(movie => 
              <li className="shoppies__nominations-item" key={uniqid()}>
                <p className="shoppies__nominations-content">{movie.Title} ({movie.Year})</p>
                <button 
                  className="shoppies__remove-button"
                  onClick={() => this.handleRemove(movie.imdbID)}
                >
                  Remove
                </button>
              </li>)}
            </ul>
          </div>
          
        </div>
      </div>
    )
  }
}
