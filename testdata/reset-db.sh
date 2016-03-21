#!/bin/bash

mongo << EOF
db.auctions.drop();
db.auctionitems.drop();
db.bids.drop();
db.users.drop();
// db.bidqueues.drop(); // only drop if server is stopped
db.vehicles.drop();
EOF

mongoimport --db test --collection auctions --drop --file testdata/auctions.json
mongoimport --db test --collection auctionitems --drop --file testdata/auctionitems.json
mongoimport --db test --collection bids --drop --file testdata/bids.json
mongoimport --db test --collection users --drop --file testdata/users.json
mongoimport --db test --collection vehicles --drop --file testdata/vehicles.json
