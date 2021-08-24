import _ from 'lodash';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  Button,
} from 'react-native';
import {apiUser, BASE_URL} from '../utils/ApiUrl';
import {StackActions} from '@react-navigation/native';

const Input = props => {
  const {placeholder, ...inputProps} = props;
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{placeholder}</Text>
      <TextInput
        {...inputProps}
        style={styles.inputForm}
        placeholder={placeholder}
        placeholderTextColor="grey"
      />
    </View>
  );
};

const Login = ({navigation}) => {
  const [dataAuth, setDataAuth] = React.useState({});
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    fetch(`${BASE_URL}${apiUser}`)
      .then(response => response.json())
      .then(data => {
        setDataAuth(data);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Error Found!');
      });
  };

  const onSubmitLogin = () => {
    if (_.isEmpty(dataAuth)) {
      Alert.alert('Error', 'Error Found!');
    } else if (_.isEqual(dataAuth, formData)) {
      navigation.dispatch(StackActions.replace('Member', {}));
    } else {
      Alert.alert('Login', 'Login Failed');
    }
  };

  const onChangeText = (key, value) => {
    setFormData(() => ({
      ...formData,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Test Mentari Intercultural School</Text>
      <Input
        placeholder="Username"
        onChangeText={text => onChangeText('username', text)}
      />
      <Input
        secureTextEntry
        placeholder="Password"
        onChangeText={text => onChangeText('password', text)}
      />
      <View style={styles.button}>
        <Button
          disabled={_.isEmpty(formData)}
          title="Login"
          onPress={onSubmitLogin}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputForm: {
    width: Dimensions.get('screen').width / 1.5,
    paddingHorizontal: 8,
    marginTop: 6,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'grey',
    color: 'black',
  },
  button: {
    width: Dimensions.get('screen').width / 1.5,
    marginTop: 16,
  },
});
