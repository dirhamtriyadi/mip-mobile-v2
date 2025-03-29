import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserData = () => {
  const [userData, setUserData] = useState({
    id: 0,
    name: '',
    email: '',
    email_verified_at: '',
    created_at: '',
    updated_at: '',
  });
  const [userDetailData, setUserDetailData] = useState({
    nik: '',
    name: '',
  });

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      
      if (user !== null) {
        const parsedUser = JSON.parse(user);
        
        setUserDetailData({
          nik: parsedUser.detail_users.nik,
          name: parsedUser.name,
        });
        setUserData(parsedUser);
      }
    } catch (error) {
      console.error('Error getting user data: ', error);
    }
  };

  return { userData, userDetailData };
};