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
      userInfo.user.updateProfile({displayName: name.trim()}).then(() => {});
    });
}

export function signout(onSignedOut) {
  auth()
    .signOut()
    .then(() => {
      onSignedOut();
    });
}

export function subscribeToAuthChanges(authStateChanged) {
  auth().onAuthStateChanged(user => {
    authStateChanged(user);
  });
}
