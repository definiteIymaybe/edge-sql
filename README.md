# Analyzing vaccination data on the Edge using SQL (on the edge)

![Deploy](https://github.com/grundprinzip/edge-sql/workflows/Deploy/badge.svg)

This repository is a fork from the original `edge-sql` project here
https://github.com/lspgn/edge-sql. All the hard work was done there and I cannot
take credit for it, it's a great idea.

The difference in this repository is the data set. Since I'm already scraping
the data from the German Roland-Koch-Institute for the daily vaccination
numbers, I felt this is an awesome approach to provide even easier access to the
data in my beloved SQL.

Thanks to Cloudflare for providing this amazing tech. It uses a [Cloudflare
Worker](https://workers.cloudflare.com/) embedding [SQLite](https://sqlite.org/)
with [WASM](https://webassembly.org/).

## Data

The data is in the `vaccinations` table and loaded with the following columns:

 * date - when the event was recorded
 * state - in which state
 * vacc_first - amount of first vaccine shots this day
 * vacc_second - amount of second vaccine shots this day
 * ewz - population in the state

## Sample Questions

The following is a list of sample questions that you can run on the dataset:


Number of rows in the dataset:

```
curl -XPOST --data \
"select count(*) from vaccinations;" \
https://sql.grundprinzip.workers.dev/query
```
```
count(*)
352
```

Number of shots given in the last 7 days:

```
curl -XPOST --data \
"select
  sum(vacc_first + vacc_second)
from vaccinations
where
  date > date('now','-7 day')
;" \
https://sql.grundprinzip.workers.dev/query
```

```
539957
```

Calculating Herd immunity based on the data:

```
curl -XPOST --data \
"with twoshots as (select
  -- We need two shots to be ready
  sum(vacc_second) as total
from vaccinations)

select round((select total from twoshots) / cast(sum(ewz) as float) * 100, 4)
from vaccinations
where date = '2021-01-01'
;" \
https://sql.grundprinzip.workers.dev/query
```

```
0.1385
```