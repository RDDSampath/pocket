import React,{useState, useEffect} from 'react';
import { FlatList, Image, Text, View, ToastAndroid, TouchableOpacity, Alert } from 'react-native';
import styles from './Styles';
import { images } from '../constants/images';
import db from '../Database/Database';
import colors from '../constants/colors';

const Dashboard = ({navigation}) => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    getAllTransaction();
    checkDelete();
    calcBalance();
    getProfile();
  }, [updateId,refresh]);

  const checkDelete = () => {
    if (updateId !== 0) {
      setIsDelete(true);
    } else {
      setIsDelete(false);
    }
  };

  //get all Transaction
  const getAllTransaction = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM transaction_table ORDER BY user_id DESC',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
            
          setData(temp);
          console.log(temp);
        }
      );
    });
  };

  const calcRevenue = () => {
    let revenue = 0;
    data.forEach((item) => {
      if (item.type === 'Revenue') {
        revenue += parseFloat(item.amount);
      }
    });
    return revenue;
  };

  const calcExpense = () => {
    let expense = 0;
    data.forEach((item) => {
      if (item.type === 'Expenditure') {
        expense += parseFloat(item.amount);
      }
    });
    return expense;
  };

  const calcBalance = () => {
    let balance = 0;
    console.log(calcRevenue());
    console.log(calcExpense());
    balance = calcRevenue() - calcExpense();
    return balance;
  };

  const deleteRefresh=()=>{
    setRefresh(!refresh);
    setUpdateId(0);
  };

   // Delete Work
let deleteTransaction = () => {
  // Show a confirmation dialog before deleting
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this work?',
    [
      {
        text: 'Cancel',
        onPress:()=>deleteRefresh(),
      },
      {
        text: 'Delete',
        onPress: () => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM  transaction_table where user_id=?',
              [updateId],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  ToastAndroid.show('Transaction deleted successfully', ToastAndroid.SHORT);
                  deleteRefresh();
                } else {
                  console.log('Please insert a valid User Id');
                }
              }
            );
          });
        },
        style: 'destructive',
      },
    ],
    { cancelable: false }
  );
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
          setProfileImage(row.profilePic);
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


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>HI {name ? name : "User !"}</Text>
        <Text style={styles.headerText}> </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileNavigation')}>
          <Image source={{uri: profileImage }} style={
            {
              height:40,
              width:40, 
              resizeMode:'cover', 
              borderRadius:20,
              borderWidth:1,
              borderColor: colors.BLACK_COLOR_F2,
            }
          }/>
        </TouchableOpacity>
      </View>
      <View style={styles.dashCard}>
      <Image source={images.logog} style={styles.dashImage}/>

      <Text style={styles.LabelText}>You have Now</Text>
      <View style={styles.card_d}>
        <Text style={styles.valueText}>Rs. {calcRevenue()}</Text>
      </View>
      <Text style={styles.LabelText}>Actual You have Now</Text>
      <View style={styles.card_d}>
      <Text style={styles.valueText}>Rs. {calcBalance()}</Text>
      </View>
      <Text style={styles.TitleText}>Your Transactions</Text>
      {isDelete ? 
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteTransaction}>
          <Image source={images.delete} style={styles.deleteBtnImage}/>
        </TouchableOpacity>
      :
      <TouchableOpacity style={styles.deleteBtn} onPress={() => setRefresh(!refresh)}>
          <Image source={images.refresh} style={styles.deleteBtnImage}/>
      </TouchableOpacity>
      }
      </View>
  { data.length === 0 ?
      <View style={styles.noPost}>
        <Text style={styles.noPostText_D}>No Transactions !</Text>
      </View>
      :
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card_dd} onLongPress={()=> setUpdateId(item.user_id)} >
            <View style={styles.card_dd_top}>
              <Text style={styles.valueText_tt}>{item.reason}</Text>
              <Text style={styles.valueText_t}>{item.type}</Text>
            </View>
            <View style={styles.card_dd_bottom}>
            <Text style={styles.valueText_b}>Name</Text>
              <Text style={styles.valueText_bb}>{item.name}</Text>
            </View>
            <View style={styles.card_dd_bottom}>
              <Text style={styles.valueText_b}>Amount</Text>
              <Text style={styles.valueText_bb}>Rs. {item.amount}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.user_id}
        scrollEnabled
        style={styles.flatlist}
      />
      
}
     
        
    </View>
  )
}

export default Dashboard;
