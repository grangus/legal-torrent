import { refresh } from "./refresh";

const start = () => {
  //load cron jobs and start them here
  refresh();
};

export default start;