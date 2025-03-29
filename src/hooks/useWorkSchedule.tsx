import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import instance from '../configs/axios';

const useWorkSchedule = () => {
  const [workSchedule, setWorkSchedule] = useState<any>(null);

  useEffect(() => {
    const getWorkSchedule = async () => {
      try {
        const response = await instance.get('v1/attendances/work-schedules');
        setWorkSchedule(response.data.data);
      } catch (error: any) {
        Alert.alert(
          'Gagal mengambil data jadwal kerja',
          'Gagal terjadi kesalahan karena:\n' + error.response.data.message,
        );
        console.log(
          'Error getting work schedule: ',
          error.response.data.message,
        );
      }
    };

    getWorkSchedule();
  }, []);

  return workSchedule;
};

export default useWorkSchedule;
