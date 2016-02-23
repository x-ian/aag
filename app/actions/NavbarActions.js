import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getCharacterCountSuccess',
      'getCharacterCountFail',
      'findCharacterSuccess',
      'findCharacterFail',
      'verifySessionSuccess',
      'verifySessionFail',
      'activeUserSuccess',
      'activeUserFail'
    );
  }

  findCharacter(payload) {
  //   $.ajax({
  //     url: '/api/characters/search',
  //     data: { name: payload.searchQuery }
  //   })
  //     .done((data) => {
  //       assign(payload, data);
  //       this.actions.findCharacterSuccess(payload);
  //     })
  //     .fail(() => {
  //       this.actions.findCharacterFail(payload);
  //     });
  }

  getCharacterCount() {
  //   $.ajax({ url: '/api/characters/count' })
  //     .done((data) => {
  //       this.actions.getCharacterCountSuccess(data)
  //     })
  //     .fail((jqXhr) => {
  //       this.actions.getCharacterCountFail(jqXhr)
  //     });
  }

  verifySession() {
    $.ajax({ url: '/api/activesession' })
      .done((data) => {
        this.actions.verifySessionSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.verifySessionFail(jqXhr)
      });
  }

  activeUser() {
    $.ajax({ url: '/api/activeuser' })
      .done((data) => {
        this.actions.activeUserSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.activeUserFail(jqXhr)
      });
  }

}

export default alt.createActions(NavbarActions);
