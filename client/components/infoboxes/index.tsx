export function LongInfoBox () {
  return (
    <div className="info-box2 mb-3">
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
  );
};

export function ShortInfoBox () {
  return (
    <div>
      <div className="info-box info-box--bg2">
        <a href="#" className="info-box__link"></a>
        <div className="info-box__icon">
          <span className="m-icon user"></span>
        </div>
        <div className="info-box__content">
          <span className="desc">Are you new here?</span>
          <h6 className="title">
            Browse the best
            <br /> torrents without limits<span className="color-l-blue1">.</span>
          </h6>
        </div>
        <div className="info-box__link-a link-arrow">
          Sign Up <span className="arrow"></span>
        </div>
      </div>
    </div>
  );
};
