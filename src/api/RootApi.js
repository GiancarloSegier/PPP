import firebase from 'react-native-firebase';

export function login({email, password}) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(value => console.log(value));
}

export function signup({email, password, displayName}) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userInfo => {
      console.log(userInfo);
      userInfo.user
        .updateProfile({displayName: displayName.trim()})
        .then(() => {});
    });
}

export function signOut(onSignedOut) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('signed out');
      onSignedOut();
    });
}
