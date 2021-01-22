// import the emscripten glue code
import emscripten from './build/module.js'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

let emscripten_module = new Promise((resolve, reject) => {
  emscripten({
    instantiateWasm(info, receive) {
      let instance = new WebAssembly.Instance(wasm, info)
      receive(instance)
      return instance.exports
    },
  }).then(module => {
    resolve({
      query: module.cwrap('query', 'string', ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string']),
      module: module,
    })
  })
})

async function fetchDataFromGoogle() {
  var cfFetchOptions = {
    // Always cache this fetch regardless of content type
    // for a max of 300 seconds before revalidating the resource
    cacheTtl: 300,
    cacheEverything: true,
};
  response = await fetch(
    "https://storage.googleapis.com/covidrefresh/database/alldata.csv",
    {
      cf: cfFetchOptions
    });
  return response.body;
}

async function handleRequest(event) {
  let request = event.request;

  let url = new URL(request.url);
  if (url.pathname == '/query') {

    let data = await fetchDataFromGoogle();

    let wmod = await emscripten_module

    let query = "SELECT count(*) FROM vaccinations;";
    if(request.method == "POST") {
        query = await request.text()
    }

    let result = wmod.query(
      "CREATE VIRTUAL TABLE temp.vaccinations USING csv(data='"+data+"',header);"+query,
      String(request.cf.country),
      String(request.cf.asn),
      String(request.cf.colo),
      String(request.cf.city),
      String(request.cf.continent),
      String(request.cf.timezone),
      String(request.cf.latitude),
      String(request.cf.longitude),
      String(request.headers.get("CF-Connecting-IP")),
      String(request.headers.get("User-Agent"))
    );

    let newResponse = new Response(result, {status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
        }
      });
    return newResponse;
  } else {
    return new Response("not found", {status: 404})
  }
}
