import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

class PromoterStatusOnAuctionItemStatus extends React.Component {

  constructor() {
    super();
  }

  onClickOpenBidding(event) {
    this.props.updateAfterAction(event, 'OPEN');
  }

  onClickFinalCall(event) {
    this.props.updateAfterAction(event, 'FINAL_CALL');
  }

  onClickFinalCallEmpty(event) {
    this.props.updateAfterAction(event, 'FINAL_CALL_EMPTY');
  }

  onClickAcceptBid(event) {
    this.props.updateAfterAction(event, 'ACCEPT');
  }

  onClickRejectBid(event) {
    this.props.updateAfterAction(event, 'REJECT');
  }

  onClickSell(event) {
    this.props.updateAfterAction(event, 'SELL');
  }

  onClickClose(event) {
    this.props.updateAfterAction(event, 'CLOSE');
  }

  render() {
    return (
        <div className='list-group'>
          <div className='panel-heading'>Status &amp; actions</div>
          <div key='button' className='list-group-item animated fadeIn'>
            <div className='media'>

              {(() => {
                switch (this.props.status) {
                  case "NOT_OPEN":
                    return <button className='btn btn-secondary' onClick={this.onClickOpenBidding.bind(this)}>Open bidding</button>;
                  case "NO_BIDS_YET":
                    return <button className='btn btn-warning' onClick={this.onClickFinalCallEmpty.bind(this)}>Final call (no bids)</button>;
                  case "WAITING_FOR_BIDS":
                    return <button className='btn btn-warning' onClick={this.onClickFinalCall.bind(this)}>Final call</button>;
                  case "INCOMING_BID":
                    return <div><button className='btn btn-success' onClick={this.onClickAcceptBid.bind(this)}>Accept bid</button>
                      &nbsp;<button className='btn btn-info' onClick={this.onClickRejectBid.bind(this)}>Reject bid</button></div>;
                  case "WAITING_FINAL_CALL":
                    return <button className='btn btn-danger' onClick={this.onClickSell.bind(this)}>Sell</button>;
                  case "WAITING_FINAL_CALL_EMPTY":
                    return <button className='btn btn-danger' onClick={this.onClickClose.bind(this)}>Close</button>;
                  case "SOLD":
                    return '';
                  case "CLOSED_EMPTY":
                    return '';
                  default:
                    return "(unknown state)";
                }
              })()}

              &nbsp;({this.props.status})
            </div>
          </div>
        </div>
    );
  }
};

export default PromoterStatusOnAuctionItemStatus;
