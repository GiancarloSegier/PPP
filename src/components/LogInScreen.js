import React, {Component} from 'react';
import AuthForm from './AuthForm';
import {login, signup} from '../api/RootApi';

class LoginScreen extends Component {
  state = {
    authMode: 'login',
  };

  // componentDidMount() {}
  // componentWillMount() {}
  switchAuthMode = () => {
    this.setState(prevState => ({
      authMode: prevState.authMode === 'login' ? 'signup' : 'login',
    }));
  };

  render() {
    return (
      <AuthForm
        login={login}
        signup={signup}
        authMode={this.state.authMode}
        switchAuthMode={this.switchAuthMode}
      />
    );
  }
}

export default LoginScreen;
