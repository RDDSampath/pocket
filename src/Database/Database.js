// Database.js
import { openDatabase } from 'react-native-sqlite-storage';

const errorCB = (err) => {
    console.error("SQL Error: " + err);
  }
  
  const successCB = () => {
    console.log("SQL executed fine");
  }
  
  const db = openDatabase({ name: 'MoneyPlanner.db' }, successCB, errorCB);

export default db;
