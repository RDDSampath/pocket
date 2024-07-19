import React,{useEffect, useState} from 'react';
import { View, Text,Image, TouchableOpacity, Modal, TextInput, ScrollView} from 'react-native';
import { images } from '../constants/images';
import styles from './Styles';
import {launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Database/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../Database/Database';

const Profile = () => {
  const [editShow, setEditShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDay, setBirthDay] = useState(new Date());
  const [imageUrl, setImageUrl] = useState('https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png');
  const [source, setSource] = useState(null);
  const [picName, setPicName] = useState(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [refresh]);

  const fetchProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('profile');
      if (profile !== null) {
        getProfile();
      } else {
        autoProfileCreate();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  

  //get profile
  const getProfile = () => {
    console.log('Fetching profile data');
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM profile_table WHERE id = ?',
        [1],
        (tx, results) => {
          if (results.rows.length > 0) {
            let row = results.rows.item(0);
            console.log('Data:', row);
            setName(row.name);
            setEmail(row.email);
            // Convert birthday from string to Date object
            setBirthDay(new Date(row.birthday));
            setImageUrl(row.profilePic);
          } else {
            console.log('No profile found');
          }
        },
        error => {
          console.error("Error fetching profile:", error);
        }
      );
    });
  };


  //Create Table
  const autoProfileCreate = () => {
    const defaultName = 'User';
    const defaultEmail = 'user@gmail.com';
    const defaultBirthday = new Date().toISOString().slice(0, 10);
    const defaultImageUrl = 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS profile_table (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, birthday TEXT, profilePic TEXT)',
        [],
        () => {
          console.log('Table created successfully or already exists.');
          tx.executeSql(
            'INSERT INTO profile_table (name, email, birthday, profilePic) VALUES (?, ?, ?, ?)',
            [defaultName, defaultEmail, defaultBirthday, defaultImageUrl],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('Profile Created Successfully');
                setRefresh(!refresh);
                AsyncStorage.setItem('profile', JSON.stringify({ defaultName, defaultEmail, defaultBirthday, defaultImageUrl }));
              } else {
                console.log('Failed to create profile');
              }
            },
            error => {
              console.error('Failed to insert profile data:', error);
            }
          );
        },
        error => {
          console.error('Failed to create table:', error);
        }
      );
    });
  };
  

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const file = response.assets[0];
        setSource(file.uri);
        console.log('Image URI:', file.uri);
        setPicName(file.fileName);
        console.log('Image Name:', file.fileName);
      }
    });
  };

  const uploadImage = async () => {
    if (!source) return;
    // Fetch the blob from local image URI
    const response = await fetch(source);
    const blob = await response.blob();
    const currentDate = new Date().toISOString(); // Corrected date usage
    const imageRef = ref(storage, `profileImages/${currentDate}/${picName}`);
    // Set up metadata
    const metadata = {
      contentType: blob.type, // This should automatically fetch the mime type
    };
    try {
      await uploadBytes(imageRef, blob, metadata);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      console.log('Image uploaded successfully: ', url);
      return url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload image');
    }
  };
  

  const updateProfile = async () => {
    const url = await uploadImage();
    let bDay = moment(birthDay).format('YYYY-MM-DD'); // for storage
  
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE profile_table SET name=?, email=?, birthday=?, profilePic=? WHERE id=?',
        [name, email, bDay, url, 1],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Profile updated successfully');
            // Save to AsyncStorage after updating in the database
            AsyncStorage.setItem('profile', JSON.stringify({ name, email, bDay, imageUrl: url }));
            setEditShow(false);
            ToastAndroid.show('Profile updated successfully', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show('Update failed', ToastAndroid.SHORT);
          }
        },
        error => {
          console.error("Error updating profile:", error);
          ToastAndroid.show('Error updating profile', ToastAndroid.SHORT);
        }
      );
    });
  };

  return (
    <ScrollView style={styles.container2}>
      <View style={styles.header2}>
        <Text style={styles.headerText2}>Profile</Text>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={()=> setEditShow(true)}>
          <Image
            source={images.edit} // Replace with your pencil icon
            style={styles.editIcon}
          />
        </TouchableOpacity>
      <Image source={{ uri: source ? source : imageUrl}} style={styles.profilePic2} />
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoContent}>{name}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Birth Day</Text>
          <Text style={styles.infoContent}>{moment(birthDay).format('YYYY-MM-DD')}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoContent}>{email}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={()=> setShowPolicy(true)}>
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={()=> setShowAbout(true)}>
        <Text style={styles.buttonText}>About Us</Text>
      </TouchableOpacity>

      <Modal
          animationType="none"
          transparent={true}
          visible={editShow}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Edit Profile</Text>

              <TouchableOpacity onPress={handleChoosePhoto}>
              <Image source={{ uri: source? source : imageUrl }} style={styles.profilePic2} />
              </TouchableOpacity>
            
              <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
            />
            <TouchableOpacity style={styles.datePicker} onPress={() => setShowDate(true)}>
                <Text style={styles.datePickerText}>Birth Day</Text>
                <Text style={styles.datePickerValue}>{moment(birthDay).format('YYYY-MM-DD')}</Text>
              </TouchableOpacity>

              <DatePicker
                  modal
                  open={showDate}
                  date={birthDay} // Initial date value
                  mode='date'
                  onConfirm={(date) => {
                      setShowDate(false);
                      setBirthDay(date); // Update goalFrom state with the selected date
                  }}
                  onCancel={() => {
                      setShowDate(false);
                  }}
                />
              <TouchableOpacity style={styles.modalBtn} onPress={updateProfile}>
                  <Text style={styles.modalBtnText}>Save    ✔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> setEditShow(false)}>
                    <Text style={styles.closeBtnText}>❌</Text>
              </TouchableOpacity>

            </View>
          </View>
          </Modal>
          <Modal
            animationType="none"
            transparent={true}
            visible={showPolicy}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Privacy Policy</Text>
              <Text style={styles.modalsubText}>Our commitment to your privacy is paramount. We collect minimal personal information necessary to provide you with the best service possible. Rest assured, your data is securely stored and used only for improving your financial experience within the app. We never share your information with third parties without your explicit consent. Your trust is our priority.</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> setShowPolicy(false)}>
                    <Text style={styles.closeBtnText}>❌</Text>
              </TouchableOpacity>

            </View>
          </View>
          </Modal>
          <Modal
            animationType="none"
            transparent={true}
            visible={showAbout}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>About</Text>
              <Text style={styles.modalsubText}>Money Planner is the solution for modern-day money management challenges. Our mobile app simplifies tracking daily transactions, setting financial goals, and managing personal finances with its user-friendly interface and essential features. Efficiently manage your money and achieve your financial objectives hassle-free.</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> setShowAbout(false)}>
                    <Text style={styles.closeBtnText}>❌</Text>
              </TouchableOpacity>

            </View>
          </View>
          </Modal>
          
    </ScrollView>
  );
};


export default Profile;
