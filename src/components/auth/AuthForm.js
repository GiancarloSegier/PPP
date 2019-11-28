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
import {Button, Text, Divider} from 'react-native-elements';

import * as yup from 'yup';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import SocialLogin from './SocialLogin.js';

const AuthForm = props => {
  if (Platform.OS === 'ios') {
    this.styles = iosUI;
  } else {
    this.styles = androidUI;
  }

  const nameInput = (
    <>
      <TextInput
        onChangeText={text => props.setFieldValue('name', text)}
        placeholder="Name"
        style={this.styles.formField}
      />
      {props.errors.name !== '' ? (
        <Text style={this.styles.formError}>{props.errors.name}</Text>
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
      <View style={this.styles.loginScreen}>
        <Image
          source={require('../../assets/logo.png')}
          style={this.styles.logoLogin}
        />
        <View style={this.styles.form}>
          <Text style={this.styles.formTitle}>
            {props.authMode === 'login' ? 'Welcome back!' : 'Welcome new user!'}
          </Text>
          {props.authMode === 'signup' ? nameInput : null}
          <TextInput
            onChangeText={text => props.setFieldValue('email', text)}
            placeholder="email"
            style={this.styles.formField}
          />
          {props.errors.email !== '' ? (
            <Text style={this.styles.formError}>{props.errors.email}</Text>
          ) : null}
          <TextInput
            secureTextEntry={true}
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
          {props.authMode === 'login' ? (
            <>
              <Divider
                style={{
                  height: 1,
                  backgroundColor: '#fff',
                  marginVertical: '10%',
                }}
              />
              <Text style={this.styles.loginSubtitle}>Or login with:</Text>
              <Button
                buttonStyle={[
                  this.styles.socialFormButton,
                  {justifyContent: 'space-between', paddingRight: '38%'},
                ]}
                titleStyle={this.styles.socialFormButtonTitle}
                onPress={props.onLoginFacebook}
                title={'Facebook'}
                icon={{
                  name: 'facebook',
                  type: 'font-awesome',
                  size: 18,
                  color: '#110b84',
                }}
              />
            </>
          ) : null}
          <Button
            buttonStyle={this.styles.secondaryFormButton}
            titleStyle={this.styles.secondaryFormButtonTitle}
            onPress={() => props.switchAuthMode()}
            title={
              props.authMode === 'login'
                ? "I don't have an account"
                : 'I have an account'
            }
          />
        </View>
      </View>
    </>
  );
};

export default withFormik({
  mapPropsToValues: () => ({email: '', password: '', name: ''}),
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
      name:
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
