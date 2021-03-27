import Head from "next/head";
import { useState } from "react";
import NavBar from "../components/NavBar";
import HomeSearch from "../components/HomeSearch";
import PopularCategories from "../components/PopularCategories";
import HomeInfoSection from "../components/HomeInfoSection";
import Separator from "../components/utils/Separator";
import PopularTorrents from "../components/PopularTorrents";
import Footer from "../components/Footer";
import { SearchResultContainer } from "../components/search";

export default function Home() {
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

  const [searchResults, setSearchResults] = useState({
    results: [],
    total: 0,
  });

  const handleSearchResults = (result: {
    results: any[];
    total: number;
  }) => {
    setSearchResults(result);
  };

  return (
    <div className="app-wrapper">
      <NavBar />

      {searchResults.results.length < 1 && (
        <div>
          <HomeSearch setSearchResults={handleSearchResults} />

          <PopularCategories />

          <Separator />

          <HomeInfoSection />
        </div>
      )}

      {searchResults.results.length > 1 && (
        <div>
          <SearchResultContainer
            results={searchResults.results}
            total={searchResults.total}
          />
          <Separator />
        </div>
      )}

      <PopularTorrents />

      <Footer />
    </div>
  );
}
