import React from "react";

interface UserInfo {
  user: {
    username: string;
    banned: boolean;
    gender: string;
    id: number;
    profileImage: string;
    bio: string;
    location: string;
    reputation: number;
    subscribers: number;
    uploads: number;
  };
}

export default class ProfilePage extends React.Component<UserInfo, {}> {
  constructor(props) {
    super(props);
  }

  //torrent content is a class that was made by the designer
  //rather than renaming it or making a separate class im just going to leave it as-is
  //i dont like css

  render() {
    return (
      <div className="torrent-content">
        <div className="container">
          <div className="content-heading">
            <div className="content-heading__title">
              <h1>Profile of {this.props.user.username}</h1>
            </div>
            <div className="content-heading__controls d-none d-sm-inline-flex">
              <div className="info-t">
                <div className="info-t__item">
                  <span className="title">{this.props.user.subscribers}</span>
                  <span className="desc">Subscribers</span>
                </div>
              </div>
              {/*add .active when already favorited*/}
              <button className="button button--border">
                <span className="s-icon2 heart"></span>
              </button>{" "}<button className="button button--border">
              <span className="s-icon2 flag"></span>
            </button>
            </div>

            
          </div>

          <div className="row">
            <div className="col-xl-7 col-lg-7">
              <div className="torrent-details default">
                <div className="torrent-details__content">
                  <div className="torrent-d-cover">
                    <img src={this.props.user.profileImage} alt="" />
                  </div>
                  <div className="torrent-d-details">
                    <div className="full-info">
                      <div className="title">
                        <h4>{this.props.user.username}</h4>
                      </div>
                      <div className="desc">
                        Location: {this.props.user.location}
                      </div>
                    </div>

                    <hr className="separator-white" />

                    <div className="info-t">
                      <div className="info-t__item">
                        <span
                          className={`title dot ${
                            this.props.user.reputation >= 0 ? "green" : "red"
                          }`}
                        >
                          {this.props.user.reputation.toLocaleString()}
                        </span>
                        <span className="desc">Reputation</span>
                      </div>
                      <div className="info-t__item">
                        <span
                          className={`title dot ${
                            this.props.user.uploads > 0 ? "green" : "red"
                          }`}
                        >
                          {this.props.user.uploads.toLocaleString()}
                        </span>
                        <span className="desc">Uploads</span>
                      </div>
                      <div className="info-t__item">
                        <span className="title">Banned</span>
                        <span className="desc">
                          {this.props.user.banned ? "Yes" : "No"}
                        </span>
                      </div>

                      {/* <div className="info-t__item">
                        <div className="title">
                          34 <span className="s-icon2 file"></span>
                        </div>
                        <span className="desc">Files</span>
                      </div> */}
                    </div>
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
            </div>
            <div className="col-xl-5 col-lg-5">
              <div className="x-small-heading mt-5 mx-3 mt-lg-0">
                <h5>Bio</h5>
              </div>
              <div className="description-block mx-3">{this.props.user.bio}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
