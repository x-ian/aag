import React from 'react';
import {Link} from 'react-router';
import Dropzone from 'react-dropzone';

import request  from 'superagent';

class ImageManager extends React.Component {

  constructor() {
    super();
  }

  onDrop(files) {
    console.log('Received files: ', files);
    var req = request.post('/api/vehiclesfull/' + this.props.vehicleId + '/addimages');
    files.forEach((file)=> {
      req.attach(file.name, file);
    });
    req.end();
  }

  render() {
    let images = '';
    if (this.props.images) {
      images = this.props.images.map((image, index) => {
        return (
          <span key={index}><img src={image.thumbnail} style={{width: '150px'}}/>&nbsp;</span>
        );
      });
    }

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Images</label>
        <div className="col-sm-10">
          {this.props.vehicleId ?
            (
              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                    <Dropzone onDrop={this.onDrop.bind(this)}>
                      <div style={{textAlign: 'center'}}><br/><br/><br/>Drag&Drop images<br/> or<br/> click to select files to upload.</div>
                    </Dropzone>
                  </div>
                  <div className="col-sm-6">
                    {images}
                  </div>
                </div>
              </div>
            ) : (
              <p className="form-control-static">Please save vehicle before adding images.</p>
            )
          }
        </div>
      </div>
    );
  }
}

export default ImageManager;
