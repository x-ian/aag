import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';

import Vehicles from './components/Vehicles';
import Vehicle from './components/Vehicle';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />

    <Route path='/vehicles/new' component={Vehicle} />
    <Route path='/vehicles/:id' component={Vehicle} />
    <Route path='/vehicles' component={Vehicles} />

  </Route>
);
