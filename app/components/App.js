import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

class App_ extends React.Component {
  render() {
    return (
      <div>
        <Navbar history={this.props.history} />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default App_;
