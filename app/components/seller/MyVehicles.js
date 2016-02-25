import React from 'react';
import {Link} from 'react-router';
import VehiclesViewShort from '../VehiclesViewShort.js';

const resetState = {
}

class MyVehicles extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
  }

  render() {
    return (
      <div>
        <div className='container'>
          <VehiclesViewShort myVehicles={true}/>
        </div>
      </div>
    );
  }
}

export default MyVehicles;
