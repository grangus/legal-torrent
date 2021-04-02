import { GetServerSideProps, GetServerSidePropsContext } from "next";
import config from "../../configs/site";
import NavBar from "../../components/NavBar";
import { SearchBar } from "../../components/search";
import PopularTorrents from "../../components/PopularTorrents";
import Footer from "../../components/Footer";
import Separator from "../../components/utils/Separator";
import ProfilePage from "../../components/profile/index";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let result = await fetch(
    `${config.scheme}://${config.api}/api/v1/user/${context.params.id}/info`
  );

  let response = await result.json();

  return {
    props: {
      response,
    },
  };
};

export default function Profile(params) {
  let user = params.response.data.user;

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
      <ProfilePage user={user} />
      <Separator />
      <PopularTorrents />
      <Footer />
    </div>
  );
}
