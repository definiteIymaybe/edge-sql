# edge-sql

This is a fork from the original repository.

![Deploy](https://github.com/lspgn/edge-sql/workflows/Deploy/badge.svg)

A [Cloudflare Worker](https://workers.cloudflare.com/) embedding [SQLite](https://sqlite.org/)
with [WASM](https://webassembly.org/) and a [simple Forex dataset](#data).

You can preview it here: [https://sql.lspgn.workers.dev](https://sql.lspgn.workers.dev).

## Data


## Try

The following query will return the days when the [British pound](https://en.wikipedia.org/wiki/Pound_sterling)
was at its lowest and highest against the dollar.

```bash
$ curl -XPOST --data \
"
SELECT COUNT(*) FROM vaccinations;
" \
-H 'content-type: application/text' \
https://sql.lspgn.workers.dev/
Date,EUR,JPY,GBP,CHF,1/EUR,1/JPY,1/GBP,1/CHF
2007-11-08,1.4666,0.008840265220012,2.10642728904847,0.883440756580929,0.681849174962498,113.118778126279,0.47473748806764,1.13193781535524
```