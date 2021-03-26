export default function HomeInfoSection() {
  return (
    <section className="info-section mt-5">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg-6">
            <div className="info-section-img">
              <a className="info-section-img__icon" href="">
                <span className="play"></span>
                <span className="border-outside"></span>
              </a>
              <div className="info-section-img__bg-elements">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0 pt-2 pt-lg-0">
            <div className="text-block-heading">
              <h3>
                Watch your favourite
                <br /> movies without downloading
                <span className="color-l-blue1">.</span>
              </h3>
            </div>
            <p className="text-content">
              Your Brosky Internet Provider and Government can track your
              download activities - downloading torrents is getting riskier
              every day. Use a VPN to make yourself hidden while downloading any
              files.
            </p>
            <a href="" className="button button--large button--border-green">
              Get VPN Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
