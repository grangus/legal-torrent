import topupdater from "./top-updater";

const start = () => {
  //load cron jobs and start them here
  topupdater();
};

export default start;
