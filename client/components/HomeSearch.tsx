import React, { ChangeEvent, FormEvent } from "react";

const search = async (term: string, category: string) => {
  const categories = {
    "0": "All",
    "1": "Movie",
    "2": "Audio",
    "3": "Software",
    "4": "Games",
    "5": "Emulation",
    "6": "GPS",
  };

  return await (await fetch("/", { method: "GET" })).json();
};

export default class HomeSearch extends React.Component<
  { setSearchResults: CallableFunction },
  { selection: string; term: string }
> {
  constructor(props) {
    super(props);

    this.state = {
      selection: "3",
      term: "",
    };

    this.handleSelection = this.handleSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  async handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let result = await search(this.state.term, this.state.selection);

    this.props.setSearchResults({
      results: result.torrents,
      total: result.total,
    });
  }

  handleSearchChange(event: ChangeEvent<HTMLFormElement>) {
    this.setState({
      term: event.target.value,
    });
  }

  handleSelection(event: ChangeEvent<HTMLSelectElement>) {
    this.setState({
      selection: event.target.value,
    });
  }

  render() {
    return (
      <section className="home-search">
        <div className="container">
          <div className="home-tagline">
            <div className="small-text">
              Welcome to
              <div className="brand">
                <span className="brand__typo">
                  Legal<small>torrent</small>
                </span>
              </div>
            </div>
            <h1>
              The best digital files library
              <span className="color-l-blue1">.</span>
              <br /> Browse from{" "}
              <span className="highlight">
                3,000,000<b>+</b>
              </span>{" "}
              torrents!
            </h1>
          </div>
          <form
            className="large-search"
            onSubmit={this.handleSubmit}
            onChange={this.handleSearchChange}
          >
            <div className="large-search-input">
              <label
                className="large-search-input__input"
                htmlFor="search-input"
              >
                <span className="s-icon search d-none d-md-inline-block"></span>
                <input
                  type="text"
                  tabIndex={1}
                  id="search-input"
                  placeholder="Movie, TV Show, Audio Book, Game, Application ..."
                />
              </label>
              <div className="large-search-input__control">
                <select
                  className="custom-select right search-category on-white"
                  value={this.state.selection}
                  onChange={this.handleSelection}
                >
                  <option value="0" disabled>
                    All Categories
                  </option>
                  <option value="1">Movies & Videos</option>
                  <option value="2">Audio</option>
                  <option value="3">Software</option>
                  <option value="4">Games</option>
                  <option value="5">Emulation</option>
                  <option value="6">GPS</option>
                </select>

                <button
                  className="button button--green button--large d-none d-md-inline-block"
                  tabIndex={2}
                  type="submit"
                >
                  Search
                </button>

                <button
                  type="submit"
                  className="button button--border d-md-none"
                >
                  <span className="s-icon search"></span>
                </button>
              </div>
            </div>
          </form>
          <span className="large-separator"></span>
        </div>

        <div className="home-search-bg-wrapper">
          <div className="container">
            <div className="home-search-bg">
              <span className="el1"></span>
              <span className="el2"></span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
