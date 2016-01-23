import React from 'react';
import {Link} from 'react-router';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'><strong>auto auction germany</strong></h3>
              <p>Vehicles from Germany. Anywhere. Anytime. Reliable.</p>
              <p>© 2016 Auto Auction Germany.</p>
            </div>
            <div className='col-sm-7 hidden-xs'>
              <br/>
              <p><strong>Users online: </strong>1</p>
                <p><strong>Next auction: </strong>unknown</p>
                  <p><strong>Vehicles in next auction: </strong>7</p>
                  <p><strong>Total vehicles available: </strong>99</p>
              {/*<ul className='list-inline'>
                {leaderboardCharacters}
              </ul>*/}
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
