#!/bin/bash

mongo << EOF
db.auctionitems.drop();
db.bids.drop();
db.users.drop();
db.bidqueue.drop();
db.vehicles.drop();
db.users.drop();
EOF

mongoimport --db test --collection vehicles --drop --file testdata/vehicles.json
