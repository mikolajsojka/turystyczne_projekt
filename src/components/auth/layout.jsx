import React from 'react';
import AppBar from 'material-ui/AppBar';
import {connect} from 'react-redux';
import {clearAuthError, loginUser, logoutUser, registerUser} from "../../redux/modules/auth/actions";
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {FlatButton, TextField} from "material-ui";
import {Tab, Tabs} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

class BarLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: false,
      email: '',
      email_register: '',
      password1: '',
      password2: '',
      password: '',
      slideIndex: 0,
      error: '',
    };
  }

  componentWillMount() {
    this.props.clearAuthError();
  }

  handleOpen = () => {
    this.setState({popup: true});
  };

  handleClose = () => {
    this.setState({popup: false});
  };

  loginButton() {
    if (this.props.user) {
      return (
        <RaisedButton
          label="Wyloguj"
          className="login-button"
          backgroundColor="#a4c639"
          onClick={(e) => {
            e.preventDefault();
            this.props.logoutUser();
          }}
        />
      )
    }
    return (
      <RaisedButton
        label="Logowanie"
        className="login-button"
        backgroundColor="#a4c639"
        onClick={this.handleOpen}
      />
    );
  }

  setField = (value, name) => {
    this.setState({[name]: value});
  };

  validateLogin = () => {
    const {email, password} = this.state;
    if (email && password) {
      this.setState({error: ''});
      this.props.loginUser(email, password);
    }
    else {
      this.props.clearAuthError();
      this.setState({error: 'Podaj login i hasło.'});
    }
  };

  validateRegister = () => {
    const {email_register, password1, password2} = this.state;
    if (email_register && password1 && password1 === password2) {
      this.setState({error: ''});
      return this.props.registerUser(email_register, password1);
    }
    this.props.clearAuthError();
    if (!password1 || !password2 || !email_register) {
      this.setState({error: 'Wszystkie pola są wymagane.'});
    }
    else {
      this.setState({error: 'Podane hasła są różne.'});
    }
  };

  handleSlide = (value) => {
    this.setState({slideIndex: value, error: ''});
    this.props.clearAuthError();
  };

  renderError() {
    return <p style={{color: 'red'}}>{this.props.error}{this.state.error}</p>;
  }

  renderLogin() {
    return (
      <div className="login-content">
        <TextField
          hintText="Podaj email"
          floatingLabelText="Email"
          onChange={(e, newValue) => this.setField(newValue, 'email')}
        />
        <br/>
        <TextField
          hintText="Podaj hasło"
          floatingLabelText="Hasło"
          type="password"
          onChange={(e, newValue) => this.setField(newValue, 'password')}
        />
        <br/>
        <FlatButton label="Zaloguj" primary={true} onClick={this.validateLogin}/>
        <br/>
        {this.renderError()}
      </div>
    );
  }

  renderRegister() {
    if (this.props.email) {
      return (
        <div style={{display: 'flex'}}>
          <h1 style={{display: 'flex', justifyContent: 'center'}}>
            Dziękujemy za rejestrację, wysłaliśmy email z potwierdzeniem.
          </h1>
        </div>
      );
    }
    return (
      <div className="login-content">
        <TextField
          hintText="Podaj email"
          floatingLabelText="Email"
          onChange={(e, newValue) => this.setField(newValue, 'email_register')}
        />
        <br/>
        <TextField
          hintText="Podaj hasło"
          floatingLabelText="Hasło"
          type="password"
          onChange={(e, newValue) => this.setField(newValue, 'password1')}
        />
        <br/>
        <TextField
          hintText="Potwierdź hasło"
          floatingLabelText="Hasło"
          type="password"
          onChange={(e, newValue) => this.setField(newValue, 'password2')}
        />
        <br/>
        <FlatButton label="Zarejestruj" primary={true} onClick={this.validateRegister}/>
        <br/>
        {this.renderError()}
      </div>
    );
  }

  render() {
    return (
      <div>
        <AppBar
          title="TurystyczneTriCity"
          iconElementRight={this.loginButton()}
          iconStyleRight={{alignSelf: 'center', marginTop: 0}}
        />
        <Dialog
          modal={false}
          open={this.state.popup && !this.props.user}
          onRequestClose={this.handleClose}
          actionsContainerStyle={{height: 100}}
        >
          <div>
            <Tabs
              onChange={this.handleSlide}
              value={this.state.slideIndex}
            >
              <Tab label="Logowanie" value={0}/>
              <Tab label="Rejestracja" value={1}/>
            </Tabs>
            <SwipeableViews
              index={this.state.slideIndex}
              onChangeIndex={this.handleSlide}
            >
              {this.renderLogin()}
              {this.renderRegister()}
            </SwipeableViews>
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    error: state.auth.error,
    email: state.auth.email,
  };
};

const mapDispatchToProps = {
  clearAuthError,
  loginUser,
  logoutUser,
  registerUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(BarLayout);
