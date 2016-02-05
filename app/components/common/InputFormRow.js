import React from 'react';
import {Link} from 'react-router';

class InputFormRow extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">{this.props.label}</label>
        <div className="col-sm-10">
          <input className='form-control'
            type={this.props.type}
            value={this.props.value}
            onChange={this.props.onChange.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default InputFormRow;
