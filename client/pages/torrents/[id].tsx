import { GetServerSideProps, GetServerSidePropsContext } from "next";
import config from "../../configs/site";
import NavBar from "../../components/NavBar";
import { SearchBar } from "../../components/search";
import PopularTorrents from "../../components/PopularTorrents";
import Footer from "../../components/Footer";
import TorrentContainer from "../../components/torrent/index";
import Separator from "../../components/utils/Separator"

interface Torrent {
  user: User;
  id: string;
  name: string;
  image: string;
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

interface TorrentInfoResponseData {
  torrent: Torrent;
  comments: Comment[];
  favorites: number;
  downloads: number;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let result = await fetch(
    `${config.scheme}://${config.api}/api/v1/torrents/${context.params.id}/info`
  );

  let response = await result.json();

  return {
    props: {
      response,
    },
  };
};

export default function Torrent(props) {
  let data: TorrentInfoResponseData = props.response.data;

  if (typeof window !== "undefined") {
    (async () => {
      const NativejsSelect = (await import("nativejs-select")).default;
      const { Modal, Tooltip, Toast } = await import("bootstrap");

      // Short aliases for JS selectors
      const query = document.querySelector.bind(document);
      const queryAll = document.querySelectorAll.bind(document);

      // Custom Select Init
      new NativejsSelect({
        selector: ".custom-select",
        // enableSearch: true
      });

      // const fromId = document.getElementById.bind(document);
      // const fromClass = document.getElementsByClassName.bind(document);
      // const fromTag = document.getElementsByTagName.bind(document);

      // Bootstrap Tooltips Init
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl);
      });

      // Bootstrap Toasts Init
      var toastElList = [].slice.call(document.querySelectorAll(".toast"));
      toastElList.map(function (toastEl) {
        // show toasts
        new Toast(toastEl).show();

        return new Toast(toastEl);
      });
    })();
  }

  return (
    <div className="app-wrapper">
      <NavBar />
      <SearchBar />
      <TorrentContainer {...data}/>
      <Separator/>
      <PopularTorrents />
      <Footer />
    </div>
  );
}
