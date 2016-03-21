#!/bin/bash

mongoexport --db test --collection auctions --out testdata/auctions.json
mongoexport --db test --collection auctionitems --out testdata/auctionitems.json
mongoexport --db test --collection bids --out testdata/bids.json
mongoexport --db test --collection users --out testdata/users.json
mongoexport --db test --collection vehicles --out testdata/vehicles.json
