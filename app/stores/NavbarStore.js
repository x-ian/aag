import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.totalCharacters = 0;
    this.onlineUsers = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';
    this.activeSession = false;
    this.activeUser = null;
  }

  onFindCharacterSuccess(payload) {
    // payload.history.pushState(null, '/characters/' + payload.characterId);
  }

  onFindCharacterFail(payload) {
    // payload.searchForm.classList.add('shake');
    // setTimeout(() => {
    //   payload.searchForm.classList.remove('shake');
    // }, 1000);
  }

  onVerifySessionSuccess(data) {
    console.log('onVerifySessionS');
    console.log(data);
    this.activeSession = data.activeSession;
  }

  onVerifySessionFail(data) {
    console.log('onVerifySessionF');
    console.log(data);
    this.activeSession = false;
  }

  onActiveUserSuccess(data) {
    console.log(data);
    this.activeUser = data.activeUser;
  }

  onActiveUserFail(data) {
    this.activeSession = null;
  }

  onUpdateOnlineUsers(data) {
    this.onlineUsers = data.onlineUsers;
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onGetCharacterCountSuccess(data) {
    this.totalCharacters = data.count;
  }

  onGetCharacterCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(NavbarStore);
