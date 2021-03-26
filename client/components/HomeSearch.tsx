export default function HomeSearch() {
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
        <div className="large-search">
          <div className="large-search-input">
            <label className="large-search-input__input" htmlFor="search-input">
              <span className="s-icon search d-none d-md-inline-block"></span>
              <input
                type="text"
                tabIndex={1}
                id="search-input"
                placeholder="Movie, TV Show, Audio Book, Game, Application ..."
              />
            </label>
            <div className="large-search-input__control">
              <select className="custom-select right search-category on-white">
                <option value="0" selected={true} disabled>
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
              >
                Search
              </button>

              <button className="button button--border d-md-none">
                <span className="s-icon search"></span>
              </button>
            </div>
          </div>
        </div>
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
