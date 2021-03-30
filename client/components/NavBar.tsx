import React from "react";
import Link from "next/link";

export default class NavBar extends React.Component<{}, { hidden: boolean }> {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (typeof window !== "undefined") {
      let body = document.querySelector("body");
      if (!body) return alert("no body!");
      body.classList.toggle("locked");
      this.setState((state) => ({
        hidden: !state.hidden,
      }));
    }
  }

  render() {
    return (
      <div>
        <div className="modal fade" id="modal-sign-in" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content narrow">
              <div className="modal-body modal-form">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>

                <div className="brand">
                  <span className="brand__symbol"></span>
                  <h2 className="brand__typo">
                    Legal<small>torrent</small>
                  </h2>
                </div>

                <div className="modal-heading">
                  <h6 className="title">
                    Welcome Back<span className="color-l-blue1">.</span>
                  </h6>
                  <span className="desc">Sign In To Account</span>
                </div>

                <div className="form-floating w-icon input-group">
                  <div className="input-group-text">
                    <span className="xs-icon user"></span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    id="input1-email"
                    placeholder="E-Mail"
                    name="email"
                    autoComplete="email"
                  />
                  <label htmlFor="input1-email">Email Address</label>
                </div>
                <div className="form-floating w-icon input-group">
                  <div className="input-group-text">
                    <span className="xs-icon lock"></span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    id="input3-password"
                    placeholder="Password"
                    name="password"
                    autoComplete="password"
                  />
                  <label htmlFor="input3-password">Password</label>
                </div>

                <div className="text-center">
                  <button className="button button--medium button--border-green mt-4">
                    Sign In
                  </button>
                </div>

                <div className="xs-desc2 text-center">
                  <a href="">Forgot your password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modal-sign-up" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content narrow">
              <div className="modal-body modal-form">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>

                <div className="brand">
                  <span className="brand__symbol"></span>
                  <h2 className="brand__typo">
                    Legal<small>torrent</small>
                  </h2>
                </div>

                <div className="modal-heading">
                  <h6 className="title">
                    Quick Sign Up<span className="color-l-blue1">.</span>
                  </h6>
                  <span className="desc">Create New Account</span>
                </div>

                <form action="">
                  <div className="form-floating w-icon input-group">
                    <div className="input-group-text">
                      <span className="xs-icon user"></span>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="input1-email"
                      placeholder="E-Mail"
                      name="email"
                      autoComplete="email"
                      required
                    />
                    <label htmlFor="input1-email">Email Address</label>
                  </div>
                  <div className="form-floating w-icon input-group">
                    <div className="input-group-text">
                      <span className="xs-icon bolt"></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="input2-username"
                      placeholder="Username"
                      name="username"
                      autoComplete="username"
                      required
                    />
                    <label htmlFor="input2-username">Public Username</label>
                  </div>
                  <div className="form-floating w-icon input-group">
                    <div className="input-group-text">
                      <span className="xs-icon lock"></span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="input3-password"
                      placeholder="Password"
                      name="password"
                      autoComplete="new-password"
                      required
                    />
                    <label htmlFor="input3-password">Password</label>
                  </div>

                  <div className="form-check form-switch mt-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                      required
                    />
                    <label
                      className="form-check-label xs-desc2"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Creating an account means you’re okay with our{" "}
                      <a href="">Terms of Service</a> and{" "}
                      <a href="">Privacy Policy</a>
                    </label>
                  </div>

                  <div className="text-center">
                    <button
                      className="button button--medium button--border-green mt-4"
                      type="submit"
                    >
                      Create Account
                    </button>
                  </div>
                </form>

                <div className="xs-desc2 text-center">
                  Already have an account? <a href="">Sign In</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mobile-nav ${this.state.hidden ? "hidden" : ""}`}>
          <div className="container">
            <div className="mobile-nav-navbar">
              <Link href="/">
                <a className="brand">
                  <span className="brand__symbol"></span>
                  <h2 className="brand__typo">
                    Legal<small>torrent</small>
                  </h2>
                </a>
              </Link>
              <div onClick={this.toggle}>
                <button
                  className={`button button--no-bg mobile-nav-toggle ${
                    this.state.hidden ? "hidden" : ""
                  }`}
                >
                  <div className="mobile-nav-close">
                    <span></span>
                    <span></span>
                  </div>
                </button>
              </div>
            </div>

            <ul className="navbar-nav">
              <li className="navbar-nav__control">
                <a
                  className="button button--border-green"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-sign-up"
                >
                  Sign Up
                </a>
                <a
                  className="button button--border"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-sign-in"
                >
                  Sign In
                </a>
              </li>
              <li className="navbar-nav__item">
                <Link href="/categories">
                  <a>
                    <span className="xs-icon magnet"></span> Categories
                  </a>
                </Link>
              </li>
              <li className="navbar-nav__item">
                <a href="">
                  <span className="xs-icon shield"></span> Get VPN
                </a>
              </li>
              <li className="navbar-nav__item">
                <Link href="/torrents/top">
                  <a>
                    <span className="xs-icon shield"></span> Get VPN
                  </a>
                </Link>
              </li>
              <li className="navbar-nav__item">
                <a href="">
                  <span className="xs-icon bolt"></span> Recent Torrents
                </a>
              </li>
            </ul>
          </div>
        </div>

        <header className="navbar navbar--large">
          <div className="container">
            <Link href="/">
              <a className="brand">
                <span className="brand__symbol"></span>
                <h2 className="brand__typo">
                  Legal<small>torrent</small>
                </h2>
              </a>
            </Link>
            <nav className="d-none d-lg-inline">
              <ul className="navbar-nav display-flex flex-row">
                <li className="navbar-nav__item">
                  <a href="">
                    <span className="xs-icon magnet"></span> Categories
                  </a>
                </li>
                <li className="navbar-nav__item">
                  <a href="">
                    <span className="xs-icon shield"></span> Get VPN
                  </a>
                </li>
                <li className="navbar-nav__item">
                  <a href="">
                    <span className="xs-icon chart"></span> Top 100
                  </a>
                </li>
                <li className="navbar-nav__item">
                  <a href="">
                    <span className="xs-icon bolt"></span> Recent Torrents
                  </a>
                </li>
                <li className="navbar-nav__control">
                  <a
                    className="button button--border"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-sign-in"
                  >
                    Sign In
                  </a>
                  <a
                    className="button button--border-green"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-sign-up"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </nav>

            <button
              className="button button--no-bg d-lg-none mobile-nav-toggle"
              onClick={this.toggle}
            >
              <div className="mobile-nav-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>

            <div className="navbar-bg">
              <div className="brand-light-wrapper">
                <span className="brand-light"></span>
              </div>
              <span className="large-separator"></span>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
