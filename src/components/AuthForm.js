import React, {Component} from 'react';

import {View, TextInput} from 'react-native';
import {withFormik} from 'formik';
import {Button, Text} from 'react-native-elements';
import styles from '../styles/ui.ios.style';

const AuthForm = props => {
  const displayNameInput = (
    <View>
      <TextInput
        onChangeText={text => props.setFieldValue('displayName', text)}
        placeholder="Display Name"
        style={{
          borderWidth: 2,
          borderColor: 'black',
          width: '100%',
          padding: 15,
        }}
      />
    </View>
  );

  return (
    <View style={{marginTop: 100, alignItems: 'center'}}>
      <Text h3>Login form</Text>
      {props.authMode === 'signup' ? displayNameInput : null}
      <TextInput
        onChangeText={text => props.setFieldValue('email', text)}
        placeholder="email"
        style={{
          borderWidth: 2,
          borderColor: 'black',
          width: '100%',
          padding: 15,
        }}
      />
      <Text>{props.errors.email}</Text>
      <TextInput
        onChangeText={text => props.setFieldValue('password', text)}
        placeholder="password"
        style={{
          borderWidth: 2,
          borderColor: 'black',
          width: '100%',
          padding: 15,
        }}
      />
      <Text>{props.errors.password}</Text>
      <Button
        onPress={() => props.handleSubmit()}
        title={props.authMode === 'login' ? 'Login' : 'Create Account'}
      />
      <Button
        onPress={() => props.switchAuthMode()}
        title={
          props.authMode === 'login' ? 'Switch to Signup' : 'Switch to login'
        }
      />
    </View>
  );
};

export default withFormik({
  mapPropsToValues: () => ({email: '', password: ''}),
  validate: (values, props) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email required';
    } else if (
      !/^[A-Z0-9, _%+-]+@[A-Z0-9, -]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Password required';
    } else if (values.password.length < 10) {
      errors.password = 'Minimum length of password is 10 characters';
    }

    if (props.authMode === 'signup') {
      if (!values.displayName) {
        errors.displayName = 'Display name required';
      } else if (values.displayName.length < 5) {
        errors.displayName = 'Minimum length of display name is 5 characters';
      }
    }
    return errors;
  },
  handleSubmit: (values, {props}) => {
    props.authMode === 'login' ? props.login(values) : props.signup(values);
  },
})(AuthForm);
