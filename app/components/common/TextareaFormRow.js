import React from 'react';
import {Link} from 'react-router';

class TextareaFormRow extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">{this.props.label}</label>
        <div className="col-sm-10">
          <textarea className='form-control'
            value={this.props.value}
            onChange={this.props.onChange.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default TextareaFormRow;
