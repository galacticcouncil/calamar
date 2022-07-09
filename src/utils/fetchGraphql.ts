import config from "../calamar-config";

export async function fetchGraphql(query: string, variables: object = {}) {
  let results = await fetch(
    // TODO: change when launch
    //`https://polkadot.indexer.gc.subsquid.io/v4/graphql`,
    //`https://kusama.indexer.gc.subsquid.io/v4/graphql`,
    config.apiEndpoint || "https://kusama.explorer.subsquid.io/graphql",
    // `https://kusama.explorer.subsquid.io/graphql`,
    // `https://${getSubdomain()}.indexer.gc.subsquid.io/v4/graphql`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  let jsonResult = await results.json();
  return jsonResult.data;
}