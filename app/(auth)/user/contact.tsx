import { Card as BaseCard } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";
import { Text } from "@/components/ThemedText";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ComponentProps, useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { useConfig } from "@/context/ConfigContext";

function ContactCard({
  iconName,
  title,
  description,
}: {
  iconName: ComponentProps<typeof Icon>["name"];
  title: string;
  description: string;
}) {
  const iconColor = useThemeColor({}, "primary");
  return (
    <BaseCard style={styles.card}>
      <Icon name={iconName} size={32} color={iconColor} />
      <View>
        <Text type="defaultSemiBold">{title}</Text>
        <Text>{description}</Text>
      </View>
    </BaseCard>
  );
}

async function geocodeAddress(address: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`,
      {
        headers: {
          "User-Agent": "GymClass - College Project/1.0 (spinasse22@gmail.com)",
        },
      }
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return { latitude: 41.805, longitude: -6.759 };
  } catch (error) {
    console.error("Error geocoding address:", error);
    return { latitude: 41.805, longitude: -6.759 };
  }
}

export default function Contact() {
  const { loading, config } = useConfig();
  const [mapRegion, setMapRegion] = useState({
    latitude: 41.805,
    longitude: -6.759,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loadingMap, setLoadingMap] = useState(true);

  useEffect(() => {
    // When config loads and has an address, geocode it
    if (!loading && config.address) {
      setLoadingMap(true);
      geocodeAddress(config.address)
        .then((coords) => {
          setMapRegion({
            ...mapRegion,
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        })
        .finally(() => {
          setLoadingMap(false);
        });
    }
  }, [loading, config.address]);

  if (loading) {
    return (
      <PageContainer contentContainerStyle={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Carregando configuração...</Text>
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <View style={{ gap: 10, marginTop: 20 }}>
        <ContactCard
          iconName="home"
          title="Nossa localização"
          description={config.address}
        />
        <ContactCard
          iconName="phone"
          title="Telefone"
          description={config.phone}
        />
        <ContactCard
          iconName="mail"
          title="Email"
          description={config.email}
        />

        {loadingMap ? (
          <View style={[styles.map, styles.mapLoading]}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Carregando mapa...</Text>
          </View>
        ) : (
          <MapView region={mapRegion} style={styles.map}>
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title="Nossa localização"
              description={config.address}
            />
          </MapView>
        )}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  map: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapLoading: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});