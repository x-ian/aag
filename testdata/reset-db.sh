#!/bin/bash

mongo << EOF
db.auctionitems.drop();
db.bids.drop();
EOF

mongoimport --db test --collection salesdocuments --drop --file testdata/salesdocuments.json
mongoimport --db test --collection vehicles --drop --file testdata/vehicles.json
