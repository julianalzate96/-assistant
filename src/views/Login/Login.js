import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Image} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {emailValidation} from '../../functions/regex';
import {_login} from '../../services/userServices';
import {_storeData} from '../../functions/session';
import { connect } from "react-redux"
import { setUser } from '../../redux/actions/actionCreator';
import { colors } from '../../styles';

function Login(props) {
  const [email, setEmail] = useState({email: '', status: false});
  const [password, setPassword] = useState('');
  const [logoSize, setLogoSize] = useState(false);
  const [alert, setAlert] = useState(false);

  const _handleSetEmail = email => {
    setEmail({
      email,
      status: emailValidation(email),
    });
  };

  const _handleSetPassword = password => {
    setPassword(password);
  };

  const _handleSubmit = async () => {
    if (email.status) {
      // handle AuthMethod
      let res = await _login({identifier: email.email, password});
      console.log("RES: ", res)
      if (res.status === 200) {
        setAlert(false);
        await _storeData(res.data.jwt);
        props.setUser(res.data)
        props.navigation.navigate("App")
      } else {
        setAlert(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Image
            source={require('../../assets/escudo_poli.jpg')}
            style={
              logoSize ? {height: 130, width: 235} : {height: 155, width: 280}
            }
          />
        </View>
      </View>
      <View style={styles.formContainer}>
        {!logoSize && alert && (
          <View style={styles.alert}>
            <Text style={styles.textAlert}>
              Correo o contraseña incorrecto!!!
            </Text>
          </View>
        )}
        <View style={styles.form}>
          <TextInput
            style={[styles.input, {color: email.status ? 'black' : 'red'}]}
            autoCompleteType="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={text => _handleSetEmail(text)}
            placeholder="Correo institucional"
            value={email.email}
            onFocus={() => setLogoSize(true)}
            onBlur={() => setLogoSize(false)}
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            onChangeText={text => _handleSetPassword(text)}
            value={password}
            placeholder="Contraseña"
            onFocus={() => setLogoSize(true)}
            onBlur={() => setLogoSize(false)}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar Sesion"
          color={colors.green}
          onPress={() => _handleSubmit()}
        />

        {!logoSize && (
          <View style={styles.textContainer}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ResetPassword')}>
              <Text style={styles.link}>Olvido su contraseña?</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.textContainer}>
          <Text>No tienes cuenta?</Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Register')}>
            <Text style={styles.link}> Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: 'green',
  },
  formContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '80%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.green,
    padding: 0,
  },
  alert: {
    backgroundColor: '#FE8787',
    borderWidth: 2,
    borderColor: 'red',
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAlert: {
    color: '#B51111',
  },
  buttonContainer: {
    flex: 1.5,
    justifyContent: 'space-evenly',
    paddingHorizontal: '10%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: 'green',
  },
});
const mapDispatchToProps = dispatch => {
  return {
    setUser: userData => {
      dispatch(setUser(userData))
    }
  }
}

export default connect(null, mapDispatchToProps)(Login)
