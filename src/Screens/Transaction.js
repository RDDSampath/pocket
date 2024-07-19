import React,{useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput,ToastAndroid } from 'react-native';
import styles from './Styles';
import { images } from '../constants/images';
import  db  from '../Database/Database';
import colors from '../constants/colors';

const Transaction = () => {
  const [revenueModalVisible, setRevenueModalVisible] = useState(false);
  const [expenditureModalVisible, setExpenditureModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if(revenueModalVisible){
      setType('Revenue');
      setDate(new Date());
    }else if (expenditureModalVisible){
      setType('Expenditure');
      setDate(new Date());
    }
  }, [revenueModalVisible, expenditureModalVisible]);


  //Create Table
  let isTableCreated = false; 
  const createTable = () => {
    db.transaction( function (tx) {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS transaction_table(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), amount VARCHAR(30), phone_number VARCHAR(15), reason TEXT, type VARCHAR(10), date VARCHAR(30))'
      );
    });
    isTableCreated = true; 
  };

  //Insert To table
  const handleInsertTransaction = () => {
    if (!isTableCreated) {
      createTable(db); // Create the table if it's not created
    }
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO transaction_table (name, amount, phone_number, reason, type, date) VALUES (?,?,?,?,?,?)',
        [name, amount, phoneNumber, reason, type, date],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            ToastAndroid.show(type+' Added Successfully', ToastAndroid.SHORT);
            setName('');
            setAmount('');
            setPhoneNumber('');
            setReason('');
            setType('');
            addRefresh();
          } else {
            ToastAndroid.show(type+' Added Failed', ToastAndroid.SHORT);
            setName('');
            setAmount('');
            setPhoneNumber('');
            setReason('');
            setType('');
            addRefresh();
          }
        },
        (error) => {
          console.error('SQL Error:', error);
        }
      );
    });
  };

  const handleInsertRevenue = () => {
    setDate(new Date());
    setType('Revenue');
    handleInsertTransaction();
    setRevenueModalVisible(false);
  };

  const handleInsertExpenditure = () => {
    setDate(new Date());
    setType('Expenditure');
    handleInsertTransaction();
    setExpenditureModalVisible(false);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.headerText_T}>Transaction</Text>
        <Image source={images.top_trans} style={styles.image_T} />

        <TouchableOpacity style={styles.Btn_T} onPress={()=> setRevenueModalVisible(!revenueModalVisible)}>
          <Text style={styles.BtnText_T}>Revenue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Btn_TT} onPress={()=> setExpenditureModalVisible(!expenditureModalVisible)}>
          <Text style={styles.BtnText_TT}>Expenditure</Text>
        </TouchableOpacity>

        <Modal
          animationType="none"
          transparent={true}
          visible={revenueModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add Revenue</Text>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                placeholderTextColor={colors.MAIN_THEME_COLOR}
                value={name}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                onChangeText={setAmount}
                placeholderTextColor={colors.MAIN_THEME_COLOR}
                value={amount}
                placeholder="Amount"
                keyboardType='number-pad'
              />
              <TextInput
                style={styles.input}
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                placeholderTextColor={colors.MAIN_THEME_COLOR}
                placeholder="Phone Number"
                keyboardType='number-pad'
              />
              <TextInput
                style={[styles.input, {height:80}]}
                onChangeText={setReason}
                value={reason}
                placeholder="Reason"
                multiline={true}
                placeholderTextColor={colors.MAIN_THEME_COLOR}
                numberOfLines={4}
                textAlignVertical='top'
              />
              <TouchableOpacity style={styles.modalBtn}onPress={handleInsertRevenue} >
                  <Text style={styles.modalBtnText}>Revenue  ✔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> setRevenueModalVisible(!revenueModalVisible)}>
                  <Text style={styles.closeBtnText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
          </Modal>
          <Modal
          animationType="none"
          transparent={true}
          visible={expenditureModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add Expenditure</Text>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Name"
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TextInput
                style={styles.input}
                onChangeText={setAmount}
                value={amount}
                placeholder="Amount"
                keyboardType='number-pad'
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TextInput
                style={styles.input}
                onChangeText={setPhoneNumber}
                value={phoneNumber}
                placeholder="Phone Number"
                keyboardType='number-pad'
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TextInput
                style={[styles.input, {height:80}]}
                onChangeText={setReason}
                value={reason}
                placeholder="Reason"
                multiline={true}
                numberOfLines={4}
                textAlignVertical='top'
                placeholderTextColor={colors.MAIN_THEME_COLOR}
              />
              <TouchableOpacity style={styles.modalBtn} onPress={handleInsertExpenditure}>
                  <Text style={styles.modalBtnText}>Expenditure  ✔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={()=> setExpenditureModalVisible(!expenditureModalVisible)}>
                    <Text style={styles.closeBtnText}>❌</Text>
              </TouchableOpacity>

            </View>
          </View>
          </Modal>
    </View>
  )
}

export default Transaction;