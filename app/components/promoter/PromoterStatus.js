import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

const resetState = {
  buttonState: "OPEN_BIDDING"
};

var ButtonStatesEnum = Object.freeze({
  "OPEN_BIDDING":1, "WAITING_FOR_BIDS":2, "INCOMING_BID":7,
  "BID_ACCEPTED":3, "BID_REJECTED":4, "FINAL_CALL":5, "SOLD":6
});

class PromoterStatus extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  onClick(event) {
    event.preventDefault();
  }

  onClickOpenBidding(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        {(() => {
  switch (this.state.buttonState) {
    case "OPEN_BIDDING":
      return <button className='btn btn-secondary' onClick={this.onClickOpenBidding.bind(this)}>Open bidding</button>;
    case "green": return "#00FF00";
    case "blue":  return "#0000FF";
    default:      return "#FFFFFF";
  }
})()}

      </div>
    );
  }

};

export default PromoterStatus;
