import React, { useEffect, useRef } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

interface LocationPickerProps {
  label: string;
  placeholder?: string;
  getCurrentLocation: () => void;
  onDragMarker?: (latitude: number, longitude: number) => void;
  location: {
    latitude: number;
    longitude: number;
    locationString: string;
  };
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  placeholder,
  getCurrentLocation,
  onDragMarker,
  location,
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && location.latitude && location.longitude) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 15, // You can adjust the zoom level
      });
    }
  }, [location.latitude, location.longitude]);

  return (
    <View style={styles.groupField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInput}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={location.locationString}
        />
        <TouchableOpacity style={styles.btnIcon} onPress={getCurrentLocation}>
          <Icon name="location-arrow" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      {location.locationString && (
        <MapView
          ref={mapRef} // Add ref to the MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}>
          {onDragMarker ? (
            <Marker
              draggable
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Lokasi Anda"
              description={location.locationString}
              onDragEnd={e => {
                if (onDragMarker) {
                  // Check if onDragMarker is defined
                  onDragMarker(
                    e.nativeEvent.coordinate.latitude,
                    e.nativeEvent.coordinate.longitude,
                  );
                }
              }}
            />
          ) : (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Lokasi Anda"
              description={location.locationString}
            />
          )}
        </MapView>
      )}
    </View>
  );
};

export default LocationPicker;
