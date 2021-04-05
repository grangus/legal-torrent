import React, { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import config from "../configs/site";

interface UserInfo {
  username: string;
  id: number;
  profileImage: string;
  role: string;
  email: string;
}

export default class NavBar extends React.Component<
  { setUser?: CallableFunction },
  {
    hidden: boolean;
    user?: UserInfo;
    registrationEmail: string;
    registrationUsername: string;
    registrationPassword: string;
    loginEmail: string;
    loginPassword: string;
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
      user: props.user,
      registrationEmail: "",
      registrationUsername: "",
      registrationPassword: "",
      loginEmail: "",
      loginPassword: "",
    };

    this.toggle = this.toggle.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCsrfToken = this.getCsrfToken.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState((s) => ({
      ...s,
      [event.target.name]: event.target.value,
    }));
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

  async register(event: FormEvent) {
    event.preventDefault();
  }

  async getCsrfToken() {
    let result = await fetch(
      `${config.scheme}://${config.api}/api/v1/auth/token`
    );

    console.log(result.headers)
    return result.headers["x-csrf-token"];
  }

  async login(event: FormEvent) {
    event.preventDefault();
    let token = await this.getCsrfToken();

    let result = await fetch(
      `${config.scheme}://${config.api}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-csrf-token": token,
        },
        body: JSON.stringify({
          email: this.state.loginEmail,
          password: this.state.loginPassword,
        }),
      }
    );

    if (result.status !== 200)
      return alert("Failed to register because response status was not 200");

    let user: UserInfo = (await result.json()).data;

    this.setState({ user: user });

    if (this.props.setUser) {
      this.props.setUser(user);
    }
  }

  render() {
    return (
      <div>
        <div className="modal fade" id="modal-upload" tabIndex={-1}>
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
                    Upload torrent<span className="color-l-blue1">.</span>
                  </h6>
                  <span className="desc">Select a torrent file to upload.</span>
                </div>

                <div className="text-center">
                  <button className="button button--medium button--border-green mt-4">
                    Select file
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modal-sign-in" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content narrow">
              <div className="modal-body modal-form" onSubmit={this.login}>
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

                <form onSubmit={this.login}>
                  <div className="form-floating w-icon input-group">
                    <div className="input-group-text">
                      <span className="xs-icon user"></span>
                    </div>
                    <input
                      onChange={this.handleChange}
                      value={this.state.loginEmail}
                      type="email"
                      className="form-control"
                      id="input1-email"
                      placeholder="E-Mail"
                      name="loginEmail"
                      autoComplete="email"
                    />
                    <label htmlFor="input1-email">Email Address</label>
                  </div>
                  <div className="form-floating w-icon input-group">
                    <div className="input-group-text">
                      <span className="xs-icon lock"></span>
                    </div>
                    <input
                      value={this.state.loginPassword}
                      onChange={this.handleChange}
                      type="password"
                      className="form-control"
                      id="input3-password"
                      placeholder="Password"
                      name="loginPassword"
                      autoComplete="password"
                    />
                    <label htmlFor="input3-password">Password</label>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="button button--medium button--border-green mt-4"
                    >
                      Sign In
                    </button>
                  </div>
                </form>

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

                <form onSubmit={this.register}>
                  <div className="form-floating w-icon input-group">
                    <div className="input-group-text">
                      <span className="xs-icon user"></span>
                    </div>
                    <input
                      onChange={this.handleChange}
                      value={this.state.registrationEmail}
                      type="email"
                      className="form-control"
                      id="input1-email"
                      placeholder="E-Mail"
                      name="registrationEmail"
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
                      onChange={this.handleChange}
                      value={this.state.registrationUsername}
                      type="text"
                      className="form-control"
                      id="input2-username"
                      placeholder="Username"
                      name="registrationUsername"
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
                      onChange={this.handleChange}
                      value={this.state.registrationPassword}
                      type="password"
                      className="form-control"
                      id="input3-password"
                      placeholder="Password"
                      name="registrationPassword"
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

            {this.state.user && (
              <ul className="mobile-user-info">
                <li className="mobile-user-info__user">
                  <div className="logged-user-info">
                    <span className="desc">Logged as</span>
                    <span className="title text-truncate">
                      {this.state.user.username}
                    </span>
                  </div>
                  <div className="logged-user-buttons">
                    <a href="" className="button button--border">
                      <div>
                        <span className="xs-icon chat"></span>
                      </div>
                    </a>
                    <a href="" className="button button--border dot">
                      <div>
                        <span className="xs-icon bell"></span>
                      </div>
                    </a>
                  </div>
                </li>
                <li>
                  <a className="color-green" href="#">
                    Upload Torrent
                  </a>
                </li>
                <li>
                  <a className="" href="#">
                    Your Uploads
                  </a>
                </li>
                <li>
                  <a className="" href="#">
                    Liked Torrents
                  </a>
                </li>
                <li>
                  <a className="" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="color-gray" href="#">
                    Logout
                  </a>
                </li>
              </ul>
            )}

            <ul className="navbar-nav">
              <li className="navbar-nav__control">
                {!this.state.user && (
                  <div>
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
                  </div>
                )}
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
                  {!this.state.user && (
                    <div>
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
                    </div>
                  )}
                  {this.state.user && (
                    <div>
                      <div className="logged-user-buttons">
                        <a href="" className="button button--border dot">
                          <div>
                            <span className="xs-icon chat"></span>
                          </div>
                        </a>
                        <a href="" className="button button--border">
                          <div>
                            <span className="xs-icon bell"></span>
                          </div>
                        </a>
                      </div>

                      <div className="dropdown">
                        <button
                          type="button"
                          className="profile-details"
                          data-bs-toggle="dropdown"
                        >
                          <div className="profile-details__stats">
                            <div>
                              <span className="xs-icon arrow-up"></span> 150
                            </div>
                            <div>
                              <span className="xs-icon arrow-down"></span> 42
                            </div>
                            <div>
                              <span className="xs-icon two-lines"></span> 3,75
                            </div>
                          </div>
                          <div className="profile-details__av">
                            <img src="src/assets/images/demo-av/2.png" alt="" />
                          </div>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <div className="logged-user-info">
                              <span className="desc">Logged as</span>
                              <span className="title text-truncate">
                                Brosky96
                              </span>
                            </div>
                          </li>
                          <li>
                            <a className="dropdown-item color-green" href="#">
                              Upload Torrent
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Your Uploads
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Liked Torrents
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Settings
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item color-gray" href="#">
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let result = await fetch(`${config.scheme}://${config.api}/api/v1/user/me`);

  let user: Promise<UserInfo> = await result.json();

  return {
    props: {
      user,
    },
  };
};
