export default function PopularCategories() {
  return (
    <section className="popular-categories">
      <div className="container">
        <div className="small-heading">
          <h4>Popular Categories</h4>

          <a href="" className="link-arrow">
            Browse All <span className="arrow"></span>
          </a>
        </div>

        <div className="row small-gutters-sm">
          <div className="col-6 col-lg-4">
            <a className="large-category" href="search-results.html">
              <div className="large-category__icon">
                <span>🎬</span>
              </div>
              <div className="large-category__content">
                <h5>Movies & Videos</h5>
                <span className="desc">510,598</span>
              </div>
            </a>
          </div>
          <div className="col-6 col-lg-4">
            <a className="large-category" href="">
              <div className="large-category__icon">
                <span>📚</span>
              </div>
              <div className="large-category__content">
                <h5>E-Book</h5>
                <span className="desc">510,598</span>
              </div>
            </a>
          </div>
          <div className="col-6 col-lg-4">
            <a className="large-category" href="">
              <div className="large-category__icon">
                <span>🔊</span>
              </div>
              <div className="large-category__content">
                <h5>Audio</h5>
                <span className="desc">510,598</span>
              </div>
            </a>
          </div>

          <div className="col-6 col-lg-4">
            <a className="large-category" href="">
              <div className="large-category__icon">
                <span>💿</span>
              </div>
              <div className="large-category__content">
                <h5>Software</h5>
                <span className="desc">510,598</span>
              </div>
            </a>
          </div>
          <div className="col-6 col-lg-4">
            <a className="large-category" href="">
              <div className="large-category__icon">
                <span>🎯</span>
              </div>
              <div className="large-category__content">
                <h5>Games</h5>
                <span className="desc">510,598</span>
              </div>
            </a>
          </div>
          <div className="col-6 col-lg-4">
            <a className="large-category" href="">
              <div className="large-category__icon">
                <span>⚙️</span>
              </div>
              <div className="large-category__content">
                <h5>Emulation</h5>
                <span className="desc">510,598</span>
              </div>
            </a>
          </div>
          <div className="col-6 col-lg-4">
            <a className="large-category" href="">
              <div className="large-category__icon">
                <span>📍</span>
              </div>
              <div className="large-category__content">
                <h5>GPS</h5>
                <span className="desc">510,598</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
