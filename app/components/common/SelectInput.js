import React from 'react';
import Select from 'react-select';

// https://github.com/JedWatson/react-select
class SelectInput extends React.Component {

  constructor() {
    super();
  }

  logChange(val) {
      console.log("Selected: " + val);
  }

  render() {
    return (
      <div>
        <Select
            name={this.props.formFieldName}
            value={this.props.value}
            options={this.props.options}
            onChange={this.props.onChange.bind(this)}
            clearable={this.props.clearable}
        />
      </div>
    );
  }
};

export default SelectInput;
