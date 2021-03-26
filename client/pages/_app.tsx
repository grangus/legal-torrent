import type { AppProps } from "next/app";

import "../styles/index.scss";
import "../node_modules/animate.css/animate.css";
import "../node_modules/bootstrap/scss/bootstrap.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
