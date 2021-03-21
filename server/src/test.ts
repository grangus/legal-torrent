import { Client, RequestParams, ApiResponse } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });

(async () => {
  const doc: RequestParams.Index = {
    index: "torrents",
    body: {
      description: "sad movie",
      name: "sadmovie2021",
    },
  };

  let result: ApiResponse = await client.index(doc);

  console.log(result);
  // let start = Date.now();

  // const query: RequestParams.Search = {
  //   index: "dogs",
  //   body: {
  //     query: {
  //       multi_match: {
  //         query: "husky",
  //         fields: ["type", "name"],
  //       },
  //     },
  //   },
  // };

  // const result: ApiResponse = await client.search(query);

  // console.log(Date.now() - start);
  // console.log(result.body.hits);
})();
