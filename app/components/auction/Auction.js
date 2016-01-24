import React from 'react';
import {Link} from 'react-router';
import BidHistory from './BidHistory.js';

const resetState = {
  vehicle: null,
  recentBids: [],
  participants: []
}

class Auction extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    let socket = io.connect();

    socket.on('recentBid', (data) => {
      console.log(data);
      console.log('IO Auction recentBids ' + this.state.recentBids);
      var newArray = this.state.recentBids.slice();
      newArray.unshift(data);
      this.setState({recentBids:newArray});
      console.log('IO Auction recentBid ' + this.state.recentBids);
    });

  }

  componentDidUpdate(prevProps) {
  }

  render() {
    return (
      <div className='container'>
        <div className='list-group'>
          <table>
            <tbody>
              <tr>
                <td>
                  Vehicle Details:<br/>
                </td>
                <td>
                  Status &amp; actions:<br/>
                </td>
              </tr>
              <tr>
                <td>
                  Bid history:<br/>
                  <BidHistory bids={this.state.recentBids}/>
                </td>
                <td>
                  Online participants:<br/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Auction;
