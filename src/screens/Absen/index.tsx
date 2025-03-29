import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../../App";
import globalStyles from "@styles/styles";
import styles from "./styles";

function AbsenScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const handleClick = (navigate: any) => {
    navigation.navigate(navigate);
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.listButton}>
        <TouchableOpacity style={styles.btn} onPress={() => handleClick('AbsenMasuk')}>
          <Text>Absen Masuk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleClick('AbsenPulang')}>
          <Text>Absen Pulang</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleClick('Sakit')}>
          <Text>Sakit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleClick('Izin')}>
          <Text>Izin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleClick('Cuti')}>
          <Text>Cuti</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default AbsenScreen;
