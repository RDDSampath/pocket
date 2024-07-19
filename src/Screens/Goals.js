import React,{ useState, useEffect } from 'react';
import { Text, View, Image, FlatList, TouchableOpacity, Modal, TextInput, ToastAndroid, Alert } from 'react-native';
import styles from './Styles';
import { images } from '../constants/images';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import db from '../Database/Database';
import colors from '../constants/colors';

const Goals = () => {
  const [goals, setGoals] = useState('');
  const [totalGoalAmount, setTotalGoalAmount] = useState('');
  const [haveGoalAmount, setHaveGoalAmount] = useState('');
  const [goalFrom, setGoalFrom] = useState(new Date());
  const [goalTo, setGoalTo] = useState(new Date());
  const [addGoalModalVisible, setAddGoalModalVisible] = useState(false);
  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const [isShowFrom, setIsShowFrom] = useState(false);
  const [isShowTo, setIsShowTo] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const date = moment(new Date()).format('YYYY-MM-DD');
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  console.log('Goal From:', goalFrom);
  console.log('Goal To:', goalTo);

  useEffect(() => {
    getAllGoal();
    calcTotalAmount();
    calcHaveAmount();
  }, [refresh]);

  const calcTotalAmount = () => {
    let total = 0;
    data.forEach((item) => {
        total += parseFloat(item.totamount); // Using parseFloat to convert string to floating-point number
    });
    return total;
};

const calcHaveAmount = () => {
    let total = 0;
    data.forEach((item) => {
        total += parseFloat(item.haveamount); // Using parseFloat to convert string to floating-point number
    });
    return total;
};
const openEdit = (id) => {
    setUpdateId(id);
    getEdit();
    setEditGoalModalVisible(true);
};

  //get all Goal
  const getAllGoal = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM goal_table ORDER BY goal_id DESC',
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
  }

  //Create Table
  let isTableCreated = false; 
  const createTable = () => {
    db.transaction( function (tx) {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS goal_table (goal_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), totamount VARCHAR(30), haveamount VARCHAR(30), fromdate VARCHAR(30), todate VARCHAR(30), date VARCHAR(30))'
      );
    });
    isTableCreated = true; 
  };

  //Insert To table
  const handleInsertGoal = () => {
    if (!isTableCreated) {
      createTable(db); // Create the table if it's not created
    }
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO goal_table (name, totamount, haveamount, fromdate, todate, date) VALUES (?,?,?,?,?,?)',
        [goals, totalGoalAmount, haveGoalAmount, goalFrom, goalTo, date],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            ToastAndroid.show('Goal Added Successfully', ToastAndroid.SHORT);
            setGoals('');
            setTotalGoalAmount('');
            setHaveGoalAmount('');
            setGoalFrom(new Date());
            setGoalTo(new Date());
            setAddGoalModalVisible(false);
            setRefresh(!refresh);
          } else {
            ToastAndroid.show('Goal Added Failed', ToastAndroid.SHORT);
            setGoals('');
            setTotalGoalAmount('');
            setHaveGoalAmount('');
            setGoalFrom(new Date());
            setGoalTo(new Date());
          }
        },
        (error) => {
          console.error('SQL Error:', error);
        }
      );
    });
  };

  //get specific day work
  let getEdit = () => {
    console.log(updateId);
    //setTableData({}); // Assuming setTableData is a state setter function
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM goal_table where goal_id = ?',
        [updateId],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            // You can access the first row using results.rows.item(0)
            const rowData = results.rows.item(0);
            console.log('rowData', rowData);
            setGoals(rowData.name);
            setTotalGoalAmount(rowData.totamount);
            setHaveGoalAmount(rowData.haveamount);
            let fromD = moment(rowData.fromdate, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').toDate();
            let toD = moment(rowData.todate, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').toDate();

            setGoalFrom(fromD);
            setGoalTo(toD);
          } else {
            console.log('No user found');
          }
        },
        (error) => {
          console.error('Error executing SQL query', error);
        }
      );
    });
  };

  const editRefresh = () => {
    setRefresh(!refresh);
    setEditGoalModalVisible(false);
    setGoals('');
    setTotalGoalAmount('');
    setHaveGoalAmount('');
    setGoalFrom(new Date());
    setGoalTo(new Date());
  };
  //Update Work
const updateGoal = () => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE goal_table set name=?, totamount=? , haveamount=?, fromdate=?, todate=?, date=? where goal_id=?',
        [goals, totalGoalAmount, haveGoalAmount, goalFrom, goalTo, date, updateId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            editRefresh();
            ToastAndroid.show('Goal updated successfully', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show('Updation Failed', ToastAndroid.SHORT);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error updating work:', error);
    // You can handle the error here, for example, by showing an error message.
    ToastAndroid.show('An error occurred while updating Goal', ToastAndroid.SHORT);
  }
};


  // Delete Work
let deleteGoal = () => {
  // Show a confirmation dialog before deleting
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this work?',
    [
      {
        text: 'Cancel',
        onPress:()=>editRefresh(),
      },
      {
        text: 'Delete',
        onPress: () => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM  goal_table where goal_id=?',
              [updateId],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  ToastAndroid.show('Goal deleted successfully', ToastAndroid.SHORT);
                  editRefresh();
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



  return (
    <View style={styles.container}>
        <Text style={styles.headerText_T}>Goals</Text>
        <Image source={images.goals_g} style={styles.image_G} />

        <View style={styles.card_G}>
          <View style={styles.card_GG}>
            <Text style={styles.LabelText_G}>Total of Goals</Text>
            <Text style={styles.valueText_G}>Rs. {calcTotalAmount()}</Text>
          </View>
          <View style={styles.card_GG}>
            <Text style={styles.LabelText_G}>Total You have</Text>
            <Text style={styles.valueText_G}>Rs. {calcHaveAmount()}</Text>
          </View>
        </View>
        {
          data.length === 0 ?
            <View style={styles.noPost_G}>
              <Text style={styles.noPostText_D}>No Transactions !</Text>
            </View>
            :
        <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card_dd} onLongPress={()=>openEdit(item.goal_id)}>
            <View style={styles.card_dd_top}>
              <Text style={styles.valueText_tt}>{item.name}</Text>
              <Text style={styles.valueText_t}>Rs. {item.totamount}</Text>
            </View>
            <View style={styles.card_dd_bottom}>
            <Text style={styles.valueText_b}>Now you have for that</Text>
              <Text style={styles.valueText_bb}>Rs. {item.haveamount}</Text>
            </View>
            <View style={styles.card_dd_bottom}>
              <Text style={styles.valueText_b}>Time Period</Text>
              <Text style={styles.valueText_bbt}> From <Text style={styles.date_st}>{moment(item.fromdate).format('YYYY-MM-DD ')}</Text>
                To <Text style={styles.date_st}>{moment(item.todate).format('YYYY-MM-DD')}</Text></Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.goal_id}
        scrollEnabled
        style={styles.flatlist}
      />
        }
      <TouchableOpacity style={styles.Btn_G} onPress={()=> setAddGoalModalVisible(true)}>
        <Text style={styles.BtnText_G}>+</Text>
      </TouchableOpacity>
      {/* Edit Goal */}
      <Modal
          animationType="none"
          transparent={true}
          visible={editGoalModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Edit Goals</Text>
              <TextInput
                style={styles.input}
                onChangeText={setGoals}
                value={goals}
                placeholder="Goals"
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TextInput
                style={styles.input}
                onChangeText={setTotalGoalAmount}
                value={totalGoalAmount}
                placeholder="Total Goal Amount"
                keyboardType='number-pad'
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TextInput
                style={styles.input}
                onChangeText={setHaveGoalAmount}
                value={haveGoalAmount}
                placeholder="Have Goal Amount"
                keyboardType='number-pad'
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <Text style={styles.TimeText}>Select Time Period</Text>
             <TouchableOpacity style={styles.datePicker} onPress={() => setIsShowFrom(true)}>
                <Text style={styles.datePickerText}>From</Text>
                <Text style={styles.datePickerValue}>{moment(goalFrom).format('YYYY-MM-DD')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.datePicker} onPress={() => setIsShowTo(true)}>
                <Text style={styles.datePickerText}>To</Text>
                <Text style={styles.datePickerValue}>{moment(goalTo).format('YYYY-MM-DD')}</Text>
              </TouchableOpacity>
              <View style={styles.modalBtns}>
                <TouchableOpacity style={[styles.modalBtn,{marginRight:50}]} onPress={updateGoal} >
                    <Text style={styles.modalBtnText}>Update  ✔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn_del} onPress={deleteGoal}>
                      <Image source={images.delete} style={styles.deleteBtnImage}/>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> setEditGoalModalVisible(!editGoalModalVisible)}>
                      <Text style={styles.closeBtnText}>❌</Text>
                </TouchableOpacity>
            </View>
          </View>
          </Modal>
          {/* ADD GOAL */}
          <Modal
          animationType="none"
          transparent={true}
          visible={addGoalModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add Goals</Text>
              <TextInput
                style={styles.input}
                onChangeText={setGoals}
                value={goals}
                placeholder="Goals"
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TextInput
                style={styles.input}
                onChangeText={setTotalGoalAmount}
                value={totalGoalAmount}
                placeholder="Total Goal Amount"
                keyboardType='number-pad'
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TextInput
                style={styles.input}
                onChangeText={setHaveGoalAmount}
                value={haveGoalAmount}
                placeholder="Have Goal Amount"
                keyboardType='number-pad'
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <Text style={styles.TimeText}>Select Time Period</Text>
             <TouchableOpacity style={styles.datePicker} onPress={() => setIsShowFrom(true)}>
                <Text style={styles.datePickerText}>From</Text>
                <Text style={styles.datePickerValue}>{moment(goalFrom).format('YYYY-MM-DD')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.datePicker} onPress={() => setIsShowTo(true)}>
                <Text style={styles.datePickerText}>To</Text>
                <Text style={styles.datePickerValue}>{moment(goalTo).format('YYYY-MM-DD')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handleInsertGoal} >
                  <Text style={styles.modalBtnText}>Goals  ✔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> setAddGoalModalVisible(!addGoalModalVisible)}>
                    <Text style={styles.closeBtnText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
          </Modal>
          <DatePicker
                  modal
                  open={isShowFrom}
                  date={goalFrom} // Use goalFrom state
                  mode='date'
                  onConfirm={(date) => {
                      setIsShowFrom(false);
                      setGoalFrom(date); // Update goalFrom state with the selected date
                  }}
                  onCancel={() => {
                      setIsShowFrom(false);
                  }}
                />
                <DatePicker
                  modal
                  open={isShowTo}
                  date={goalTo} // Use goalTo state
                  mode='date'
                  minimumDate={new Date()}
                  onConfirm={(date) => {
                      setIsShowTo(false);
                      setGoalTo(date); // Update goalTo state with the selected date
                  }}
                  onCancel={() => {
                      setIsShowTo(false);
                  }}
                />
    </View>
  )
}

export default Goals;