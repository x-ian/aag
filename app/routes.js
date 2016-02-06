import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';

import Vehicles from './components/Vehicles';
import VehicleEdit from './components/VehicleEdit';
import VehicleView from './components/VehicleView';
import Auctions from './components/Auctions';
import Auction from './components/Auction';

import PromoterAuctions from './components/promoter/Auctions';
import PromoterAuction from './components/promoter/Auction';
import PromoterVehicle from './components/promoter/Vehicle';
import PromoterAuctionItem from './components/promoter/AuctionItem';

import BidderStart from './components/bidder/Start';
import BidderAuction from './components/bidder/Auction';

export default (
  <Route component={App}>
    <Route path='/' component={BidderStart} />

    <Route path='/vehicles/new' component={VehicleEdit} />
    <Route path='/vehicles/:id' component={VehicleEdit} />
    <Route path='/vehicles' component={Vehicles} />
    <Route path='/vehicles/view/:id' component={VehicleView} />

    <Route path='/auctions/new' component={Auction} />
    <Route path='/auctions/:id' component={Auction} />
    <Route path='/auctions' component={Auctions} />

    <Route path='/promoter/auctions' component={PromoterAuctions} />
    <Route path='/promoter/auctions/:id' component={PromoterAuction} />
    <Route path='/promoter/vehicles/:id' component={PromoterVehicle} />

      <Route path='/promoter/auctionitem/:id' component={PromoterAuctionItem} />

    <Route path='/bidder/start' component={BidderStart} />
    <Route path='/bidder/auction/:id' component={BidderAuction} />

  </Route>
);
