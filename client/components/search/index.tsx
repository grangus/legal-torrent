import Link from "next/link";

interface SearchResult {
  link: string;
  name: string;
  exclusive: boolean;
  category: "Movie" | "EBook" | "Audio" | "Software" | "Games" | "Emulation";
  date: string;
  uploader: string;
  commentCount: number;
  size: string;
  leechers: number;
  seeders: number;
}

interface SearchResultContainerProps {
  results: SearchResult[];
  total: number;
}

const categoryEmotes = {
  Movie: "🎬",
  EBook: "📚",
  Audio: "🔊",
  Software: "💿",
  Games: "🎯",
  Emulation: "⚙️",
};

//TODO: translate everything

export function SearchResultContainer(props: SearchResultContainerProps) {
  return (
    <div>
      <section className="search-bar">
      <div className="container">
        <div className="search-input">
          <label className="search-input__input" htmlFor="search-input">
            <span className="s-icon search"></span>
            <input type="text" tabIndex={1} id="search-input" placeholder="Movie, TV Show, Audio Book, Game, Application ..."/>
          </label>
          <div className="search-input__control">
            <select className="custom-select right search-category">
              <option value="0" selected={true} disabled>All Categories</option>
              <option value="1">Movies & Videos</option>
              <option value="2">Audio</option>
              <option value="3">Software</option>
              <option value="4">Games</option>
              <option value="5">Emulation</option>
              <option value="6">GPS</option>
            </select>

            <button className="button button--dark button--l-text d-none d-md-inline-block" tabIndex={2}>Search</button>
            <button className="button button--dark d-md-none">
              <span className="s-icon search"></span>
            </button>
          </div>
          <div className="search-input__border"></div>
        </div>
      </div>
    </section>
    
    <section className="search-results">
      <div className="container">
      <div className="content-heading">
        <div className="content-heading__title">
          <h3>
            Search Results{" "}
            <span className="desc d-none d-sm-inline">
              {props.results.length} Torrent{props.results.length !== 1 ? "s" : ""}
            </span>
          </h3>
        </div>

        <div className="content-heading__controls">
          <div className="sorting-wrapper">
            <span className="desc">Sort by:</span>
            <select className="custom-select right sorting">
              <option value="1">Newest First</option>
              <option value="2">Oldest First</option>
              <option value="2">Exclusive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-lg-4">
          <div className="category-list-wrapper not-expanded-lg">
            <div className="category-list-wrapper__show">
              <button className="button button--border">Show Categories</button>
            </div>
            <nav>
              <ul className="category-list">
                <li>
                  <a href="" className="category-list-item group">
                    <div className="category-list-item__icon">
                      <span>🎬</span>
                    </div>
                    <div className="category-list-item__content">
                      <span className="title">Movies & Videos</span>{" "}
                      <span className="badge">51</span>
                    </div>
                    <div className="category-list-item__group"></div>
                  </a>
                  <div className="category-list-item-sub hidden">
                    <ul>
                      <li>
                        <a href="">Animation</a>
                      </li>
                      <li>
                        <a href="">Concert</a>
                      </li>
                      <li>
                        <a href="">Documentary</a>
                      </li>
                      <li>
                        <a href="">Movie</a>
                      </li>
                      <li>
                        <a href="">TV Show</a>
                      </li>
                      <li>
                        <a href="" className="active">
                          Sport
                        </a>
                      </li>
                      <li>
                        <a href="">Sport</a>
                      </li>
                      <li>
                        <a href="">Video Clip</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <a href="" className="category-list-item group">
                    <div className="category-list-item__icon">
                      <span>📚</span>
                    </div>
                    <div className="category-list-item__content">
                      <span className="title">E-Books</span>
                    </div>
                    <div className="category-list-item__group"></div>
                  </a>
                  <div className="category-list-item-sub hidden">
                    <ul>
                      <li>
                        <a href="">Animation</a>
                      </li>
                      <li>
                        <a href="">Concert</a>
                      </li>
                      <li>
                        <a href="">Documentary</a>
                      </li>
                      <li>
                        <a href="">Movie</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <a href="" className="category-list-item">
                    <div className="category-list-item__icon">
                      <span>🔊</span>
                    </div>
                    <div className="category-list-item__content">
                      <span className="title">Audio</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="" className="category-list-item">
                    <div className="category-list-item__icon">
                      <span>💿</span>
                    </div>
                    <div className="category-list-item__content">
                      <span className="title">Software</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="" className="category-list-item">
                    <div className="category-list-item__icon">
                      <span>🎯</span>
                    </div>
                    <div className="category-list-item__content">
                      <span className="title">Games</span>{" "}
                      <span className="badge">5</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="" className="category-list-item">
                    <div className="category-list-item__icon">
                      <span>⚙️</span>
                    </div>
                    <div className="category-list-item__content">
                      <span className="title">Emulation</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="" className="category-list-item">
                    <div className="category-list-item__icon">
                      <span>📍</span>
                    </div>
                    <div className="category-list-item__content">
                      <span className="title">GPS</span>
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="info-box info-box--bg1">
            <a href="#" className="info-box__link"></a>
            <div className="info-box__icon">
              <span className="m-icon monitor"></span>
            </div>
            <div className="info-box__content">
              <span className="desc">Looking for a better way?</span>
              <h6 className="title">
                Your favourite movies without downloading
                <span className="color-l-blue1">.</span>
              </h6>
            </div>
            <div className="info-box__link-a link-arrow">
              Know more <span className="arrow"></span>
            </div>
          </div>

          <div className="info-box info-box--bg2">
            <a href="#" className="info-box__link"></a>
            <div className="info-box__icon">
              <span className="m-icon user"></span>
            </div>
            <div className="info-box__content">
              <span className="desc">Are you new here?</span>
              <h6 className="title">
                Browse the best
                <br /> torrents without limits
                <span className="color-l-blue1">.</span>
              </h6>
            </div>
            <div className="info-box__link-a link-arrow">
              Sign Up <span className="arrow"></span>
            </div>
          </div>

          <div className="info-box info-box--bg1 d-none d-lg-block">
            <a href="#" className="info-box__link"></a>
            <div className="info-box__icon">
              <span className="m-icon shield"></span>
            </div>
            <div className="info-box__content">
              <span className="desc">Take care of safety</span>
              <h6 className="title">
                Anyone can see what
                <br /> you’re downloading
                <span className="color-l-blue1">.</span>
              </h6>
            </div>
            <div className="info-box__link-a link-arrow">
              Get VPN <span className="arrow"></span>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-8">
          <div className="torrent-list">
            <div className="torrent-list-item torrent-list-item--labels">
              <div className="torrent-list-item__title">
                <span className="label">Torrent Name</span>
              </div>
              <div className="torrent-list-item__details">
                <div>
                  <span className="label">Size</span>
                </div>
                <div>
                  <span className="label">SE</span>
                </div>
                <div>
                  <span className="label">LE</span>
                </div>
              </div>
            </div>

            {props.results.map((result) => {
              return <SearchResult {...result} />;
            })}

            <div className="content-load">
              <div
                className={`content-load__status ${
                  props.total == props.results.length ? "" : "hidden"
                }`}
              >
                End of results...
              </div>
              <div
                className={`content-load__button ${
                  props.total == props.results.length ? "hidden" : ""
                }`}
              >
                <button className="button button--border bg">Load More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
    </div>
  );
}

export function SearchResult(props: SearchResult) {
  return (
    <div className="torrent-list-item">
      <Link href={props.link}>
        <a className="torrent-list-item__link"></a>
      </Link>
      <div className="torrent-list-item__icon">
        <span>{categoryEmotes[props.category]}</span>
      </div>
      <div className="torrent-list-item__title">
        <div className="title-wrapper">
          <h5 className="title">{props.name}</h5>
          {props.exclusive ? <span className="vip">E</span> : ""}
        </div>
        <div className="desc">
          <span>{props.date}</span> <span>{props.uploader}</span>{" "}
          <span>
            {props.commentCount} Comment{props.commentCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="torrent-list-item__details">
        <div>
          <span>{props.size}</span>
        </div>
        <div>
          <span
            className={`${
              props.seeders > props.leechers ? "dot green" : "dot red"
            }`}
          >
            {props.seeders}
          </span>
        </div>
        <div>
          <span>{props.leechers}</span>
        </div>
      </div>
    </div>
  );
}
