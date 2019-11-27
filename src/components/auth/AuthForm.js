import React, {Component} from 'react';

import {View, TextInput} from 'react-native';
import {withFormik} from 'formik';
import {Button, Text} from 'react-native-elements';
import * as yup from 'yup';

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
  mapPropsToValues: () => ({email: '', password: '', displayName: ''}),
  validationSchema: props =>
    yup.object().shape({
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .min(10)
        .required(),
      displayName:
        props.authMode === 'signup'
          ? yup
              .string()
              .min(5)
              .required()
          : null,
    }),
  handleSubmit: (values, {props}) => {
    props.authMode === 'login' ? props.login(values) : props.signup(values);
  },
})(AuthForm);
