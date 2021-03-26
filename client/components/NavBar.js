import React, { useState } from "react";

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (typeof window !== "undefined") {
      document.querySelector("body").classList.toggle("locked");
      this.setState((state) => ({
        hidden: !state.hidden,
      }));
    }
  }

  render() {
    return (
      <div>
        <div className={`mobile-nav ${this.state.hidden ? "hidden" : ""}`}>
          <div className="container">
            <div className="mobile-nav-navbar">
              <a href="dev.html" className="brand">
                <span className="brand__symbol"></span>
                <h2 className="brand__typo">
                  Legal<small>torrent</small>
                </h2>
              </a>
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
                  href=""
                  className="button button--border-green"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-sign-up"
                >
                  Sign Up
                </a>
                <a
                  href=""
                  className="button button--border"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-sign-in"
                >
                  Sign In
                </a>
              </li>
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
            </ul>
          </div>
        </div>

        <header className="navbar navbar--large">
          <div className="container">
            <a href="dev.html" className="brand">
              <span className="brand__symbol"></span>
              <h2 className="brand__typo">
                Legal<small>torrent</small>
              </h2>
            </a>
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
                    href=""
                    className="button button--border"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-sign-in"
                  >
                    Sign In
                  </a>
                  <a
                    href=""
                    className="button button--border-green"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-sign-up"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </nav>

            <button className="button button--no-bg d-lg-none mobile-nav-toggle" onClick={this.toggle}>
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
