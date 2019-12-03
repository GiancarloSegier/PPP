import firebase from 'react-native-firebase';

export function login({email, password}) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(value => console.log(value));
}

export function signup({email, password, name}) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userInfo => {
      // console.log(userInfo);
      userInfo.user.updateProfile({displayName: name.trim()}).then(() => {});
    });
}

export function signout(onSignedOut) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('signed out');
      onSignedOut();
    });
}

export function subscribeToAuthChanges(authStateChanged) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log(user);
    authStateChanged(user);
  });
}
