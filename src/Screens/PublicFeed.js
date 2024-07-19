import React,{useState, useEffect} from 'react';
import { Image, Text, TouchableOpacity, View, Modal,TextInput, FlatList, ToastAndroid } from 'react-native';
import styles from './Styles';
import { 
  responsiveScreenHeight as SH,
  responsiveScreenWidth as SW,
  responsiveScreenFontSize as RF,
} from 'react-native-responsive-dimensions';
import Api from '../Api/Api';
import { images } from '../constants/images';
import {launchImageLibrary} from 'react-native-image-picker';
import moment from 'moment';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbref, push, set, onValue } from 'firebase/database';
import { storage, db as dbf } from '../Database/firebase';
import db from '../Database/Database';
import colors from '../constants/colors';




const PublicFeed = () => {
  const [Show, setShow] = useState(false);
  const [name, setName] = useState('User'); // Replace with actual user name
  const [profilePic, setProfilePic] = useState('https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'); // Replace with actual image URL
  const [content, setContent] = useState('');
  const [postPic, setPostPic] = useState(''); // Replace with actual image URL
  const [refresh, setRefresh] = useState(false);
  const [posts, setPosts] = useState([]);
  const [source, setSource] = useState(null);
  const [picName, setPicName] = useState(null);
  const [date, setDate] = useState(new Date());
  const dateFormat = date.toISOString();

  useEffect(() => {
    getPosts();
    getProfile();
  }, [refresh]);

  const getPosts = () => {
    try{
    const postRef = dbref(dbf, 'post');
          onValue(postRef, (snapshot) => {
          const items = snapshot.val();
          const newPosts = [];
          for (let id in items) {
            newPosts.push({ id, ...items[id] });
          }
          setPosts(newPosts);
          console.log('Posts:', newPosts);
          });
        } catch (error) {
          console.error('Error fetching posts:', error);
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
            setProfilePic(row.profilePic);
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

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const file = response.assets[0];
        setSource(file.uri);
        setPicName(file.fileName);
      }
    });
  };


  const uploadImage = async () => {
    if (!source) return;
  
    // Fetch the blob from local image URI
    const response = await fetch(source);
    const blob = await response.blob();
    const imageRef = ref(storage, `postImages/${picName}`);
    // Set up metadata
    const metadata = {
      contentType: blob.type, // This should automatically fetch the mime type
    };
    try {
      await uploadBytes(imageRef, blob, metadata);
      const url = await getDownloadURL(imageRef);
      setPostPic(url);
      console.log('Image uploaded successfully: ', url);
      return url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload image');
    }
  };

  const savePost = () => {

    uploadImage()
    .then((url) => {
    const postData = {
      name,
      profilePic,
      postPic: url? url : postPic,
      content,
    };
    //firebase database save
    const postRef = dbref(dbf, 'post');
    const newPostRef = push(postRef);
    set(dbref(dbf, 'post/'+ newPostRef.key), {
      name: postData.name,
      date: dateFormat,
      profilePic: postData.profilePic,
      postPic: postData.postPic,
      content: postData.content,
    })
    .then(() => {
      ToastAndroid.show('Posted', ToastAndroid.SHORT);
      setSource(null);
      setContent('');
  }).catch(error => {
      ToastAndroid.show('Failed', ToastAndroid.SHORT);
      console.log('Error:', error);
  });
  }).finally(() => {
    setShow(false);
    setRefresh(!refresh);
  });
  };

  return (
    <View style={[styles.container,{backgroundColor:colors.MAIN_THEME_COLOR_50}]}>
      <View style={styles.header}>
        <View style={styles.header_box}>
          <TouchableOpacity onPress={()=> {setShow(true), setDate(new Date())}} >
            <Image source={images.addpost} style={styles.feedIcon}/>
          </TouchableOpacity>
        </View>
        <View style={[styles.header_box,{width:'SW(50)'}]}>
        <Text style={styles.headerText_T}>Public Feed </Text>
        </View>
        <View style={styles.header_box}>
        <TouchableOpacity onPress={() => setRefresh(!refresh)} >
            <Image source={images.refresh} style={styles.feedIconr}/>
          </TouchableOpacity>
        </View>
      </View>
      { posts.length === 0 ? 
      <View style={[styles.container,{backgroundColor: colors.BLACK_COLOR_90}]}>
      <Image source={images.loading} style={[styles.loading,{alignSelf:'center',marginTop:'80%'}]} resizeMode='contain' />
      </View>
        :
      <FlatList
        data={posts}
        renderItem={({item})=>(
          <View>
          <View style={styles.post_d}>
            <View style={styles.post_header}>
              <Image source={{ uri: item.profilePic }} style={styles.postprofPic} />
              <View>
                  <Text style={styles.postnameText}>{item.name}</Text>
                  <Text style={styles.postDateText}>
                    {console.log('Posts date:', item.date)}
                    {moment(item.date).startOf('minutes').fromNow()}
                    </Text>
              </View>
            </View>
            <View style={styles.postBody}>
              <Image source={{ uri: item.postPic }} style={styles.PostPc} />
            </View>
          </View>
          <View style={styles.postContent}>
              <Text style={styles.contentText}>{item.content}</Text>
          </View>
          </View>
        )}
        keyExtractor={(item)=>item._id}
      />
}


      <Modal
          animationType="none"
          transparent={true}
          visible={Show}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Create Public post</Text>

              <TouchableOpacity onPress={handleChoosePhoto}>
              {source ? 
                <Image source={{ uri: source }} style={styles.profilePic} /> :
                <Image source={images.upload} style={styles.profilePic} />
              }
              
              </TouchableOpacity>
            
              <TextInput
              style={[styles.input,{height:SH(12)}]}
              onChangeText={setContent}
              value={content}
              placeholder="Post Content ..."
              multiline={true}
              numberOfLines={4}
              textAlignVertical='top'
            />
              <TouchableOpacity style={styles.modalBtn} onPress={savePost}>
                  <Text style={styles.modalBtnText}>Post   ✔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> {setShow(false); setSource(null)}}>
                    <Text style={styles.closeBtnText}>❌</Text>
              </TouchableOpacity>

            </View>
          </View>
          </Modal>
        
    </View>
  )
}

export default PublicFeed;