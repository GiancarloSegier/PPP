import auth from '@react-native-firebase/auth';

export function login({email, password}) {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(value => console.log(value));
}

export function signup({email, password, name}) {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userInfo => {
      // console.log(userInfo);
      userInfo.user.updateProfile({displayName: name.trim()}).then(() => {});
    });
}

export function signout(onSignedOut) {
  auth()
    .signOut()
    .then(() => {
      console.log('signed out');
      onSignedOut();
    });
}

export function subscribeToAuthChanges(authStateChanged) {
  auth().onAuthStateChanged(user => {
    // console.log(user);
    authStateChanged(user);
  });
}
