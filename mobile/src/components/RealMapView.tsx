import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

// Coordinate reali dei porti del Lazio e Campania
const allPortsCoordinates = {
  // Lazio
  "Civitavecchia": { lat: 42.0942, lng: 11.7939 },
  "Gaeta": { lat: 41.2058, lng: 13.5696 },
  "Terracina": { lat: 41.2857, lng: 13.2443 },
  "San Felice Circeo": { lat: 41.3574, lng: 13.0847 },
  "Ponza": { lat: 40.8992, lng: 12.9619 },
  "Ventotene": { lat: 40.7969, lng: 13.4279 },
  "Formia": { lat: 41.2567, lng: 13.6050 },
  "Sperlonga": { lat: 41.2566, lng: 13.4343 },
  "Santa Marinella": { lat: 42.0345, lng: 11.8709 },
  "Ladispoli": { lat: 41.9436, lng: 12.0818 },
  "Ostia": { lat: 41.7351, lng: 12.2928 },
  "Nettuno": { lat: 41.4539, lng: 12.6619 },
  "Montalto di Castro": { lat: 42.3489, lng: 11.6092 },
  // Campania
  "Napoli": { lat: 40.8358, lng: 14.2488 },
  "Salerno": { lat: 40.6824, lng: 14.7681 },
  "Sorrento": { lat: 40.6262, lng: 14.3775 },
  "Amalfi": { lat: 40.6340, lng: 14.6027 },
  "Positano": { lat: 40.6281, lng: 14.4889 },
  "Capri": { lat: 40.5506, lng: 14.2436 },
  "Ischia": { lat: 40.7335, lng: 13.9334 },
  "Procida": { lat: 40.7592, lng: 14.0158 },
  "Pozzuoli": { lat: 40.8266, lng: 14.1188 },
  "Castellammare di Stabia": { lat: 40.7026, lng: 14.4853 },
  "Agropoli": { lat: 40.3504, lng: 14.9928 },
  "Palinuro": { lat: 40.0292, lng: 15.2839 },
  "Marina di Camerota": { lat: 40.0072, lng: 15.3626 },
  "Sapri": { lat: 40.0710, lng: 15.6295 },
  "Cetara": { lat: 40.6543, lng: 14.7024 },
  "Maiori": { lat: 40.6483, lng: 14.6417 },
  "Minori": { lat: 40.6505, lng: 14.6288 }
};

interface RealMapViewProps {
  onPortSelect?: (port: string) => void;
}

export default function RealMapView({ onPortSelect }: RealMapViewProps) {
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Barche per porto con prezzi reali
  const getBoatsForPort = (port: string) => {
    const distribution: Record<string, { count: number, minPrice: number, maxPrice: number, boats: Array<{name: string, price: number, type: string}> }> = {
      "Civitavecchia": { 
        count: 15, 
        minPrice: 120, 
        maxPrice: 1200,
        boats: [
          { name: "Azimut 55", price: 980, type: "Yacht" },
          { name: "Jeanneau Sun Odyssey 439", price: 350, type: "Barca a vela" },
          { name: "Zodiac Pro 650", price: 280, type: "Gommone" }
        ]
      },
      "Gaeta": { 
        count: 12, 
        minPrice: 150, 
        maxPrice: 850,
        boats: [
          { name: "Zodiac Pro 550", price: 280, type: "Gommone" },
          { name: "Ferretti 681", price: 850, type: "Yacht" },
          { name: "Beneteau First 45", price: 320, type: "Barca a vela" }
        ]
      },
      "Ponza": { 
        count: 18, 
        minPrice: 180, 
        maxPrice: 950,
        boats: [
          { name: "Pershing 62", price: 950, type: "Yacht" },
          { name: "Lagoon 380", price: 550, type: "Catamarano" }
        ]
      },
      "Terracina": { 
        count: 8, 
        minPrice: 140, 
        maxPrice: 650,
        boats: [
          { name: "Princess V48", price: 580, type: "Yacht" },
          { name: "Beneteau Oceanis 40.1", price: 320, type: "Barca a vela" }
        ]
      },
      "Santa Marinella": { 
        count: 4, 
        minPrice: 180, 
        maxPrice: 420,
        boats: [
          { name: "Sessa Marine C30", price: 350, type: "Yacht" }
        ]
      },
      "Ostia": { 
        count: 7, 
        minPrice: 130, 
        maxPrice: 480,
        boats: [
          { name: "Cranchi Mediterranee 43", price: 450, type: "Yacht" }
        ]
      }
    };
    return distribution[port] || { count: 0, minPrice: 0, maxPrice: 0, boats: [] };
  };

  const handleMarkerPress = (port: string) => {
    setSelectedPort(port);
    setModalVisible(true);
    onPortSelect?.(port);
  };

  const centerCoordinate = {
    latitude: 41.5,
    longitude: 12.5,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={centerCoordinate}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {Object.entries(allPortsCoordinates).map(([port, coords]) => {
          const portData = getBoatsForPort(port);
          return (
            <Marker
              key={port}
              coordinate={{
                latitude: coords.lat,
                longitude: coords.lng,
              }}
              title={port}
              description={`${portData.count} barche disponibili`}
              onPress={() => handleMarkerPress(port)}
            >
              <View style={styles.markerContainer}>
                <View style={[styles.marker, portData.count > 0 ? styles.markerActive : styles.markerInactive]}>
                  <Icon name="boat" size={16} color="white" />
                </View>
                {portData.count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{portData.count}</Text>
                  </View>
                )}
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>€{portData.minPrice}+</Text>
                </View>
              </View>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{port}</Text>
                  <Text style={styles.calloutText}>{portData.count} barche disponibili</Text>
                  <Text style={styles.calloutPrice}>€{portData.minPrice} - €{portData.maxPrice}/giorno</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Modal con dettagli porto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPort && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPort}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Icon name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                {(() => {
                  const portData = getBoatsForPort(selectedPort);
                  return (
                    <ScrollView style={styles.modalBody}>
                      <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>
                          {portData.count} barche disponibili
                        </Text>
                        <Text style={styles.priceRange}>
                          €{portData.minPrice} - €{portData.maxPrice}/giorno
                        </Text>
                      </View>
                      
                      <Text style={styles.boatsTitle}>Barche Popolari:</Text>
                      {portData.boats.map((boat, index) => (
                        <View key={index} style={styles.boatCard}>
                          <View style={styles.boatInfo}>
                            <Text style={styles.boatName}>{boat.name}</Text>
                            <Text style={styles.boatType}>{boat.type}</Text>
                          </View>
                          <View style={styles.boatPrice}>
                            <Text style={styles.boatPriceText}>€{boat.price}/giorno</Text>
                            <TouchableOpacity style={styles.detailsButton}>
                              <Text style={styles.detailsButtonText}>Dettagli</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  );
                })()}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerActive: {
    backgroundColor: '#0ea5e9',
  },
  markerInactive: {
    backgroundColor: '#6b7280',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f97316',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceTag: {
    marginTop: 4,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  priceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#111827',
  },
  calloutText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  calloutPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceRange: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  boatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  boatCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  boatInfo: {
    flex: 1,
  },
  boatName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  boatType: {
    fontSize: 12,
    color: '#6b7280',
  },
  boatPrice: {
    alignItems: 'flex-end',
  },
  boatPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  detailsButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#0ea5e9',
    textDecorationLine: 'underline',
  },
});