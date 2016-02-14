import React from 'react';
import {Link} from 'react-router';

const resetState = {
  maxRows: null,
  maxChars: null
}

class MultiLineView extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  shortenTextAndReplaceNewlines(text) {
    var shortText = text;
    var shortened = false;
    if (this.props.maxChars && text.length > this.props.maxChars) {
      shortText = text.substring(0, this.props.maxChars);
      shortened = true;
    }
    var shortTokens = shortText.split('\n');
    if (this.props.maxRows && this.props.maxRows < shortTokens.length) {
      shortTokens = shortTokens.splice(0, this.props.maxRows);
      shortened = true;
    }
    return shortTokens.join('<br/>') + (shortened ? '&nbsp;&nbsp;&nbsp;(..more..)' : '');
  }

  render() {
    let text = this.shortenTextAndReplaceNewlines(this.props.text);

    return (
      <div dangerouslySetInnerHTML={{__html: text}}/>
    );
  }
}

export default MultiLineView;
