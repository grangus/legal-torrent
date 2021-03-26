export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-10">
            <div className="row">
              <div className="col-sm-8">
                <div className="footer-nav-group">
                  <div className="footer-nav-group__heading">
                    <a href="" className="brand">
                      <span className="brand__symbol"></span>
                      <h2 className="brand__typo">
                        Legal<small>torrent</small>
                      </h2>
                    </a>
                  </div>
                  <nav className="footer-nav-group__nav">
                    <div className="row">
                      <div className="col-6">
                        <ul>
                          <li>
                            <a href="#">All Categories</a>
                          </li>
                          <li>
                            <a href="#">Get Best VPN</a>
                          </li>
                          <li>
                            <a href="#">Top 100 Torrents</a>
                          </li>
                        </ul>
                      </div>
                      <div className="col-6">
                        <ul>
                          <li>
                            <a href="#">Register Account</a>
                          </li>
                          <li>
                            <a href="#">Sign In</a>
                          </li>
                          <li>
                            <a href="#">Recent Torrents</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
              <div className="col-sm-4 mt-4 mt-sm-0">
                <div className="footer-nav-group">
                  <div className="footer-nav-group__heading">
                    <h5>Support</h5>
                  </div>
                  <nav className="footer-nav-group__nav">
                    <ul>
                      <li>
                        <a href="#">All Categories</a>
                      </li>
                      <li>
                        <a href="#">Get Best VPN</a>
                      </li>
                      <li>
                        <a href="#">Top 100 Torrents</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <hr className="separator-line" />

            <div className="footer-end">
              <div className="btc-address">
                <span className="btc-address__icon"></span>
                <span className="btc-address__content">
                  <b>Donate BTC:</b> 1p73r4wiz4Q4pabeuU1UuDA7invDc1z9r
                </span>
              </div>
              <div className="footer-end__desc">
                Total Verified Torrents: 3,160,544
              </div>
              <div className="footer-end__copyrights">
                <span>© 2021 All Copyrights Reserved - Legaltorrent</span>
                <div className="dropdown dropup">
                  <button
                    type="button"
                    className="button button--border dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    ENG
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        English
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        French
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Spain
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ultra-glob-wrapper">
          <span className="ultra-glob"></span>
        </div>
        <span className="large-separator"></span>
      </div>
      <span className="footer-bg"></span>
    </footer>
  );
}
