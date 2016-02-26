import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';
var ImageGallery = require('react-image-gallery');

class VehicleThumbnails extends React.Component {

  handleClick(index) {
    console.log('handleClick');
    $("#modal" + index).modal("show");
  }

  render() {
    var onlyThumbnails = [];
    if (this.props.images && this.props.images[0]) {
      this.props.images.forEach((image)=> {
        onlyThumbnails.push({original: null, thumbnail: image.thumbnail});
      });
    }

    let imagePopups = this.props.images.map((image, index) => {
      return (
        <div className="modal fade" id={"modal" + index} key={"modal" + index} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <img src={image.original} style={{width: '500px'}}/>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
        <div className='list-group'>
          <div className='panel-heading'>Vehicle images</div>
          <div className='list-group-item'>
          { this.props.images && this.props.images[0] ?
            (
              <div>
              {imagePopups}
              <ImageGallery
                items={onlyThumbnails}
                autoPlay={false}
                slideInterval={5000}
                showNav={true}
                onSlide={this.handleClick.bind(this)}
                onClick={this.handleClick.bind(this)}
              />
              </div>
            ) : (
              <img src='/img/no-image.png' style={{width: '100px'}}/>
            )
          }
          </div>
        </div>
    );
  }

};

export default VehicleThumbnails;
