import React from "react";
import { CommentContainer } from "../comments/index";

interface TorrentInfo {
  user: User;
  id: string;
  image: string;
  name: string;
  status: "UNCONFIRMED" | "BLOCKED" | "AVAILABLE";
  category: string;
  size: string;
  negative_ratings: number;
  positive_ratings: number;
  description: string;
  seeders: number;
  leechers: number;
}

interface User {
  username: string;
  profileImage: string;
}

interface Comment {
  id: string;
  comment: string;
  createdAt: string;
  userId: number;
  torrentId: string;
  repliesTo: string;
  replyCommentId: string;
  user: User;
}

interface TorrentData {
  torrent: TorrentInfo;
  comments: Comment[];
  favorites: number;
  downloads: number;
}

export default class Torrent extends React.Component<TorrentData, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="torrent-content">
        <div className="container">
          <div className="content-heading">
            <div className="content-heading__title">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Search</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">Software</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">Operating System</a>
                  </li>
                </ol>
              </nav>
              <h1>{this.props.torrent.name}</h1>
            </div>
            <div className="content-heading__controls d-none d-lg-inline-flex">
              <div className="info-t">
                <div className="info-t__item">
                  <span className="title">{this.props.favorites}</span>
                  <span className="desc">Favorites</span>
                </div>
              </div>
              {/*add .active when already favorited*/}
              <button className="button button--border">
                <span className="s-icon2 heart"></span>
              </button>{" "}
            </div>

            <button className="button button--border">
              <span className="s-icon2 flag"></span>
            </button>
          </div>

          <div className="row">
          <div className="col-xl-7 col-lg-7">
            <div className="torrent-details default">
              <div className="torrent-details__content">
                <div className="torrent-d-cover">
                  <span className="icon">💿</span>
                  <img src={this.props.torrent.image} alt="" />
                </div>
                <div className="torrent-d-details">
                  <div className="full-info">
                    <div className="title">
                      <h4>{this.props.torrent.name}</h4>
                    </div>
                    <div className="desc">Microsoft</div>
                  </div>

                  <hr className="separator-white" />

                  <div className="user-info">
                    <div className="user-info__av">
                      <a href="">
                        <img
                          src={this.props.torrent.user.profileImage}
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="user-info__content">
                      <a href="">{this.props.torrent.user.username}</a>
                      <span className="desc">Uploaded on 12 Dec 2020</span>
                    </div>
                  </div>
                  <div className="info-t">
                    <div className="info-t__item">
                      <span className="title dot green">
                        {this.props.torrent.seeders}
                      </span>
                      <span className="desc">Seeds</span>
                    </div>
                    <div className="info-t__item">
                      <span className="title dot red">
                        {this.props.torrent.leechers}
                      </span>
                      <span className="desc">Leech</span>
                    </div>
                    <div className="info-t__item">
                      <span className="title">
                        {this.props.torrent.size.split(" ")[0]}
                        <small>{this.props.torrent.size.split(" ")[1]}</small>
                      </span>
                      <span className="desc">Size</span>
                    </div>
                    
                      <div className="info-t__item">
                        <div className="title">
                          34 <span className="s-icon2 file"></span>
                        </div>
                        <span className="desc">Files</span>
                      </div>
                      
                  </div>
                </div>
              </div>
              <div className="torrent-details__download">
                <div className="torrent-d-download">
                  <a href="" className="button button--large-w-arrow">
                    <span className="text">
                      Download<small>torrent</small>
                    </span>
                    <span className="arrow"></span>
                  </a>
                  <a href="" className="link-normal">
                    Anonymous Download
                  </a>
                </div>
                <div className="torrent-d-download-right">
                  <div className="button-wrapper">
                    <a href="" className="button-play">
                      <span className="button-play__icon"></span>
                      <span className="button-play__content">
                        <b>Watch Movies</b> without downloading
                      </span>
                    </a>
                  </div>
                  {/*
                      <span className="xs-desc">
                        INFO HASH : 70D05292F4BDC561EBA208CB0D7F87796E93286A
                      </span>
                    */}
                </div>
              </div>
              <div className="torrent-details__bg">
                <span
                  className="image"
                  style={{
                    backgroundImage: `url(src/assets/images/default-cover.png)`,
                  }}
                ></span>
              </div>
            </div>

            <div className="info-box2">
              <a href="#" className="info-box2__link"></a>
              <div className="info-box2__icon">
                <span className="m-icon user"></span>
              </div>
              <div className="info-box2__content">
                <span className="desc">Are you new here?</span>
                <h6 className="title">
                  Browse the best torrents without limits
                  <span className="color-l-blue1">.</span>
                </h6>
                <div className="link-arrow">
                  Sign Up <span className="arrow"></span>
                </div>
              </div>
              <div className="info-box2__bg">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            {/*
                <div className="info-box2">
                <a href="#" className="info-box2__link"></a>
                <div className="info-box2__icon">
                  <span className="m-icon shield"></span>
                </div>
                <div className="info-box2__content">
                  <span className="desc">Take care of safety</span>
                  <h6 className="title">
                    Anyone can see what you’re downloading
                    <span className="color-l-blue1">.</span>
                  </h6>
                  <div className="link-arrow">
                    Get VPN <span className="arrow"></span>
                  </div>
                </div>
                <div className="info-box2__bg">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="info-box2">
                <a href="#" className="info-box2__link"></a>
                <div className="info-box2__icon">
                  <span className="m-icon monitor"></span>
                </div>
                <div className="info-box2__content">
                  <span className="desc">Looking for a better way?</span>
                  <h6 className="title">
                    Your favourite movies without downloading
                    <span className="color-l-blue1">.</span>
                  </h6>
                  <div className="link-arrow">
                    Know more <span className="arrow"></span>
                  </div>
                </div>
                <div className="info-box2__bg">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              
              */}

            <div className="x-small-heading mt-5">
              <h5>Comments</h5>

              <div className="sorting-wrapper">
                <span className="desc">Sort by:</span>
                <select className="custom-select right sorting">
                  <option value="1">Newest First</option>
                  <option value="2">Oldest First</option>
                </select>
              </div>
            </div>

            {/*comments*/}
            <CommentContainer comments={this.props.comments} />
          </div>
          <div className="col-xl-5 col-lg-5">
            <div className="x-small-heading mt-4 mt-lg-0">
              <h5>Description</h5>
            </div>
            <div className="description-block">
              {this.props.torrent.description}
            </div>
            <span className="xs-desc d-none d-lg-block d-xl-none">
              INFO HASH : 70D05292F4BDC561EBA208CB0D7F87796E93286A
            </span>

            <div className="x-small-heading mt-5">
              <h5>Images</h5>
            </div>

            <div className="images-gallery">
              <div className="row small-gutters">
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/962950_1.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="#" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/962953.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/965139_1.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/964097_1.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/964095_1.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/965140_1.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/968808_1.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-3 col-4">
                  <a href="" className="images-gallery-item">
                    <img
                      src="https://fwcdn.pl/fph/31/97/813197/968806_1.2.jpg"
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="x-small-heading mt-5">
              <h5>Files</h5>
            </div>

            <div className="files-list">
              <ul>
                <li>
                  <span className="s-icon2 file-dark"></span> Read Me{" "}
                  <small>.txt</small>
                </li>
                <li>
                  <span className="s-icon2 file-dark"></span> The Mandalorian
                  S02E01 <small>.mp4</small>
                </li>
                <li>
                  <span className="s-icon2 file-dark"></span> The Mandalorian
                  S02E02 <small>.mp4</small>
                </li>
                <li>
                  <span className="s-icon2 file-dark"></span> The Mandalorian
                  S02E03 <small>.mp4</small>
                </li>
                <li>
                  <span className="s-icon2 file-dark"></span> The Mandalorian
                  S02E04 <small>.mp4</small>
                </li>
                <li>
                  <span className="s-icon2 file-dark"></span> The Mandalorian
                  S02E05 <small>.mp4</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>

        
      </div>
    );
  }
}
