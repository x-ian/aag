#!/bin/bash

# mongoexport --db test --collection vehicles --out testdata/vehicles2.json
# mongoexport --db test --collection users --out testdata/users.json

mongo << EOF
db.auctionitems.drop();
db.bids.drop();
db.users.drop();
db.bidqueue.drop();
db.vehicles.drop();
EOF

mongoimport --db test --collection vehicles --drop --file testdata/vehicles.json
mongoimport --db test --collection users --drop --file testdata/users.json
