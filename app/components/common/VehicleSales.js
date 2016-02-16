import React from 'react';
import {Link} from 'react-router';

class VehicleSales extends React.Component {

  constructor() {
    super();
  }

  onClickBuyNow(event) {
    event.preventDefault();
    // <button className='btn btn-primary' onClick={this.onClickBuyNow.bind(this)}>Buy now</button></div>;
  }

  render() {
    return (
      <div>
        <div className="modal fade" id="buyNowModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="myModalLabel">Buy vehicle now?</h4>
              </div>
              <div className="modal-body">

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Confirm Buy now</button>
              </div>
            </div>
          </div>
        </div>

        {(() => {
          switch (this.props.vehicle.status) {
            case 'DRAFT':
              return <div>Draft (private)</div>;
            case 'IN_AUCTION':
              return <div>In current auction</div>;
            case 'PUBLISHED':
              if (this.props.vehicle.buyNowAmount > 0)
                return <div><strong>{ this.props.vehicle.buyNowAmount }&nbsp;€</strong>&nbsp;<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#buyNowModal">Buy now</button></div>;
              return <div>Only for auction</div>;
            case 'SOLD_BUY_NOW':
              return <div>Already sold</div>;
            case 'SOLD_AUCTION':
              return <div>Already sold</div>;
            default:
              return <div>Unknown status ({this.props.vehicle.status})</div>;
          }
        })()}
      </div>
    );
  }
}

export default VehicleSales;
