import React from 'react';
import moment from "moment";
import DateTimeField from "react-bootstrap-datetimepicker";

class DateTimeSelect extends React.Component {

  constructor() {
    super();
  }

  render() {
    if (this.props.dateTime) {
      var dt = <DateTimeField
              ref={this.props.ref}
              format='YYYY-MM-DDTHH:mm:ss.SSSZZ'
              inputFormat='DD.MM.YYYY HH:mm'
              onChange={this.props.onChange}
              showToday={true}
              dateTime={this.props.dateTime}
            />
        } else {
          var dt = <DateTimeField
                  ref={this.props.ref}
                  inputFormat='DD.MM.YYYY HH:mm'
                  onChange={this.props.onChange}
                  showToday={true}
                  defaultText=''
                />
        }

    return (
      <div>
        {dt}
      </div>


    );
  }
};

export default DateTimeSelect;
