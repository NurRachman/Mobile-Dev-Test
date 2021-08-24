import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import React from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  Dimensions,
  Button,
  FlatList,
} from 'react-native';
import {apiMember, BASE_URL} from '../utils/ApiUrl';
import {LocalMember, LocalPostMember} from '../utils/Constants';
import NetInfo from '@react-native-community/netinfo';

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

const MemberItem = ({nama, usia}) => {
  return (
    <View style={styles.memberItem}>
      <Text style={styles.memberNama}>Nama : {nama}</Text>
      <Text>Usia : {usia}</Text>
    </View>
  );
};

const Member = () => {
  const [dataMember, setDataMember] = React.useState([]);
  const [isOnline, setIsOnline] = React.useState(true);
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    getDataMember();
  }, []);

  React.useEffect(() => {
    function handleFirstConnectivityChange(connectionInfo) {
      setIsOnline(connectionInfo.isConnected);

      if (connectionInfo.isConnected) {
        AsyncStorage.getItem(LocalPostMember).then(value => {
          let dataPrev = [];
          if (!_.isEmpty(value)) {
            dataPrev = JSON.parse(value);
          } else {
            dataPrev = [];
          }

          console.log('dataPrev', dataPrev);

          dataPrev.forEach(item => {
            fetch(`${BASE_URL}${apiMember}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(item),
            })
              .then(response => response.json())
              .then(data => {})
              .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Error Found!');
              });
          });

          AsyncStorage.setItem(LocalPostMember, '');
        });
      }
    }
    const unsubscribe = NetInfo.addEventListener(handleFirstConnectivityChange);

    return unsubscribe;
  }, []);

  const getDataMember = () => {
    fetch(`${BASE_URL}${apiMember}`)
      .then(response => response.json())
      .then(data => {
        setDataMember(data);
        AsyncStorage.setItem(LocalMember, JSON.stringify(data));
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Error Found!');

        AsyncStorage.getItem(LocalMember).then(value => {
          if (!_.isEmpty(value)) {
            setDataMember(JSON.parse(value));
          }
        });
      });
  };

  const onChangeText = (key, value) => {
    setFormData(() => ({
      ...formData,
      [key]: value,
    }));
  };

  const onSubmit = () => {
    const payload = {
      id: dataMember.length + 1,
      ...formData,
    };
    if (false) {
      fetch(`${BASE_URL}${apiMember}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          setFormData({});
          const tempAllData = [...dataMember];
          tempAllData.push(payload);
          setDataMember(tempAllData);

          AsyncStorage.setItem(LocalMember, JSON.stringify(tempAllData));
        })
        .catch(err => {
          console.error(err);
          Alert.alert('Error', 'Error Found!');
        });
    } else {
      AsyncStorage.getItem(LocalPostMember).then(value => {
        let dataPrev = [];
        if (!_.isEmpty(value)) {
          dataPrev = JSON.parse(value);
        } else {
          dataPrev = [];
        }

        console.log('dataPrev', dataPrev);

        dataPrev.push(payload);

        console.log('dataPrev', dataPrev);

        AsyncStorage.setItem(LocalPostMember, JSON.stringify(dataPrev));
      });

      setFormData({});
      const tempAllData = [...dataMember];
      tempAllData.push(payload);
      setDataMember(tempAllData);

      AsyncStorage.setItem(LocalMember, JSON.stringify(tempAllData));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Member</Text>
      <Input
        placeholder="Name"
        value={formData?.nama}
        onChangeText={text => onChangeText('nama', text)}
      />
      <Input
        keyboardType="number-pad"
        placeholder="Usia"
        value={formData?.usia}
        onChangeText={text => onChangeText('usia', text)}
      />
      <View style={styles.buttonContainer}>
        <Button
          disabled={_.isEmpty(formData)}
          title="Tambah"
          onPress={onSubmit}
        />
      </View>
      <Text style={styles.title}>List Member</Text>
      <FlatList
        data={dataMember}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return <MemberItem {...item} />;
        }}
      />
    </View>
  );
};

export default Member;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputForm: {
    paddingHorizontal: 8,
    marginTop: 6,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'grey',
    color: 'black',
  },
  buttonContainer: {
    marginTop: 16,
  },
  memberItem: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'grey',
    padding: 8,
  },
  memberNama: {
    marginTop: 4,
  },
});
