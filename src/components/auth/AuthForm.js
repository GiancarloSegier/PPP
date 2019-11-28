import React, {Component} from 'react';

import {
  View,
  TextInput,
  Platform,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {withFormik} from 'formik';
import {Button, Text} from 'react-native-elements';
import * as yup from 'yup';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

const AuthForm = props => {
  if (Platform.OS === 'ios') {
    this.styles = iosUI;
  } else {
    this.styles = androidUI;
  }

  const displayNameInput = (
    <>
      <TextInput
        onChangeText={text => props.setFieldValue('displayName', text)}
        placeholder="Display Name"
        style={this.styles.formField}
      />
      {props.errors.displayName !== '' ? (
        <Text style={this.styles.formError}>{props.errors.displayName}</Text>
      ) : null}
    </>
  );

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />
      <ScrollView
        style={this.styles.loginScreen}
        contentContainerStyle={{
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Image
          source={require('../../assets/logo.png')}
          style={this.styles.logoLogin}
        />
        <View style={this.styles.form}>
          <Text style={this.styles.formTitle}>
            {props.authMode === 'login' ? 'Welcome back!' : 'Welcome new user!'}
          </Text>
          {props.authMode === 'signup' ? displayNameInput : null}
          <TextInput
            onChangeText={text => props.setFieldValue('email', text)}
            placeholder="email"
            style={this.styles.formField}
          />
          {props.errors.email !== '' ? (
            <Text style={this.styles.formError}>{props.errors.email}</Text>
          ) : null}
          <TextInput
            onChangeText={text => props.setFieldValue('password', text)}
            placeholder="password"
            style={this.styles.formField}
          />
          {props.errors.password !== '' ? (
            <Text style={this.styles.formError}>{props.errors.password}</Text>
          ) : null}
          <Button
            buttonStyle={this.styles.primaryFormButton}
            titleStyle={this.styles.primaryFormButtonTitle}
            onPress={() => props.handleSubmit()}
            title={props.authMode === 'login' ? 'Login' : 'Create Account'}
          />
          <Button
            buttonStyle={this.styles.secondaryFormButton}
            titleStyle={this.styles.secondaryFormButtonTitle}
            onPress={() => props.switchAuthMode()}
            title={
              props.authMode === 'login' ? 'new account' : 'I have an account'
            }
          />
        </View>
      </ScrollView>
    </>
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
