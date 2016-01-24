import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';

import Vehicles from './components/Vehicles';
import Vehicle from './components/Vehicle';
import Auctions from './components/Auctions';
import Auction from './components/Auction';

import PromoterAuctions from './components/promoter/Auctions';
import PromoterAuction from './components/promoter/Auction';
import PromoterVehicle from './components/promoter/Vehicle';

import AuctionStart from './components/auction/Start';
import AuctionIndex from './components/auction/Auction';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />

    <Route path='/vehicles/new' component={Vehicle} />
    <Route path='/vehicles/:id' component={Vehicle} />
    <Route path='/vehicles' component={Vehicles} />

    <Route path='/auctions/new' component={Auction} />
    <Route path='/auctions/:id' component={Auction} />
    <Route path='/auctions' component={Auctions} />

    <Route path='/promoter/auctions' component={PromoterAuctions} />
    <Route path='/promoter/auctions/:id' component={PromoterAuction} />
    <Route path='/promoter/vehicles/:id' component={PromoterVehicle} />

    <Route path='/auction/start' component={AuctionStart} />
    <Route path='/auction/index' component={AuctionIndex} />

  </Route>
);
