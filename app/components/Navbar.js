import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
    NavbarActions.getCharacterCount();
    NavbarActions.verifySession();

    $(document).ajaxStart(() => {
      NavbarActions.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        NavbarActions.updateAjaxAnimation('fadeOut');
      }, 750);
    });
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findCharacter({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  activeSession() {
    $.ajax({
      url: '/api/activesession',
      type: 'GET',
      dataType: 'json',
      cache: false,
    }).done((data) => {
        this.setState({auction: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header' style={{paddingBottom: '10px'}}>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand'>
            <span className={'triangles animated ' + this.state.ajaxAnimationClass}>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
            </span>
            <img src="/img/aag.jpg"/>
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Buyer<span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/vehicles'>Browse Vehicles</Link></li>
              </ul>
            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Seller<span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/vehicles/new'>Add Vehicle</Link></li>
                <li><Link to='/vehicles'>My Vehicles</Link></li>
              </ul>
            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Account<span className='caret'></span></a>
              <ul className='dropdown-menu'>
              <li><Link to='/'>Details</Link></li>
              <li><Link to='/'>Create account</Link></li>
              <li><Link to='/'>Log in/out</Link></li>
              </ul>
            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Promoter<span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/auctions/new'>New auction</Link></li>
                <li><Link to='/auctions'>All auctions</Link></li>
                <li><Link to='/promoter/auctions'>Start auction</Link></li>
              </ul>
            </li>
            {
              this.state.activeSession ?
                <li><a href='/logout'>Logout</a></li>
              :
                <li><Link to='/login'>Login</Link></li>
            }

          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
