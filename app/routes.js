import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';

import Vehicles from './components/Vehicles';
import VehicleEdit from './components/VehicleEdit';
import VehicleView from './components/vehicle/details/VehicleView';
import Auctions from './components/Auctions';
import Auction from './components/Auction';
import Users from './components/Users';
import User from './components/User';

import PromoterAuctions from './components/promoter/Auctions';
import PromoterAuction from './components/promoter/Auction';
import PromoterVehicle from './components/promoter/Vehicle';
import PromoterAuctionItem from './components/promoter/AuctionItem';

import SellerVehicles from './components/vehicle/list/SellerMyVehicles';
import SellerSales from './components/vehicle/list/SellerMySales';

import BuyerPurchases from './components/vehicle/list/BuyerMyPurchases';
import BuyerVehicles from './components/vehicle/list/BuyerAvailableVehicles';

import BidderStart from './components/bidder/Start';
import BidderAuction from './components/bidder/Auction';

import Register from './components/user/Register';
import Login from './components/user/Login';
import Account from './components/user/Account';

export default (
  <Route component={App}>
    <Route path='/' component={BidderStart} />

    <Route path='/vehicles/new' component={VehicleEdit} />
    <Route path='/vehicles/:id' component={VehicleEdit} />
    <Route path='/vehicles' component={Vehicles} />
    <Route path='/vehicles/view/:id' component={VehicleView} />

    <Route path='/seller/vehicles' component={SellerVehicles} />
    <Route path='/seller/sales' component={SellerSales} />

    <Route path='/buyer/purchases' component={BuyerPurchases} />
    <Route path='/buyer/vehicles' component={BuyerVehicles} />

    <Route path='/auctions/new' component={Auction} />
    <Route path='/auctions/:id' component={Auction} />
    <Route path='/auctions' component={Auctions} />

    <Route path='/users/new' component={User} />
    <Route path='/users/:id' component={User} />
    <Route path='/users' component={Users} />

    <Route path='/promoter/auctions' component={PromoterAuctions} />
    <Route path='/promoter/auctions/:id' component={PromoterAuction} />
    <Route path='/promoter/vehicles/:id' component={PromoterVehicle} />

    <Route path='/promoter/auctionitem' component={PromoterAuctionItem} />

    <Route path='/bidder/start' component={BidderStart} />
    <Route path='/bidder/auction' component={BidderAuction} />

    <Route path='/register' component={Register} />
    <Route path='/login' component={Login} />
    <Route path='/account' component={Account} />

  </Route>
);
