import {action, observable, decorate, configure} from 'mobx';
import {
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from 'react-native-fbsdk';
import {Alert} from 'react-native';

import rootStore from './index';

configure({enforceActions: 'observed'});

class UserStore {
  loggedIn = false;
  userName = '';
  userImg = '';
  userMail = '';

  constructor(rootStore) {
    this.rootStore = rootStore;
    console.log(this.user);
  }

  _responseInfoCallback = (error, result) => {
    if (error) {
      Alert.alert('Error fetching data: ' + error);
    } else {
      this.userName = result.name;
      this.userImg = result.picture.data.url;
      this.userMail = result.email;
      this.loggedIn = true;
    }
  };

  getFBToken() {
    AccessToken.getCurrentAccessToken().then(data => {
      console.log(data);
      const infoRequest = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string:
                'email,name,first_name,middle_name,last_name, picture.type(large)', // what you want to get
            },
            access_token: {
              string: data.accessToken, // put your accessToken here
            },
          },
        },
        this._responseInfoCallback, // make sure you define _responseInfoCallback in same class
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    });
  }

  logOut() {
    this.userName = '';
    this.userImg = '';
    this.userMail = '';
    this.loggedIn = false;
  }
}

decorate(UserStore, {
  property: observable,
  loggedIn: observable,
  setUser: action,
  getFBToken: action,
  logOut: action,
  _responseInfoCallback: action,
});

export default UserStore;
