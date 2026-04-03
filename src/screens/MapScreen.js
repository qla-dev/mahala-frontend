import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { colors } from "../constants/theme";
import { projectMaskedCoordinate } from "../utils/map";

const RADII = [1, 2.5, 5];

export default function MapScreen({ posts, city, onOpenPost }) {
  const [radiusKm, setRadiusKm] = useState(2.5);

  const markers = useMemo(() => {
    if (!city) {
      return [];
    }

    return posts.filter((post) => post.masked.ringKm <= radiusKm).map((post) => ({
      ...post,
      coordinate: projectMaskedCoordinate(city, post.masked.bearingDeg, post.masked.ringKm)
    }));
  }, [city, posts, radiusKm]);

  if (!city) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: city.latitude,
          longitude: city.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08
        }}
      >
        <Circle center={{ latitude: city.latitude, longitude: city.longitude }} radius={radiusKm * 1000} strokeColor="rgba(255,255,255,0.55)" fillColor="rgba(139,92,246,0.09)" />
        {markers.map((post) => (
          <Marker key={post.id} coordinate={post.coordinate} onPress={() => onOpenPost(post)}>
            <View style={[styles.marker, { backgroundColor: post.color }]} />
          </Marker>
        ))}
      </MapView>

      <View style={styles.hudTop}>
        <View style={styles.hudCard}>
          <Text style={styles.hudKicker}>Privacy mask</Text>
          <Text style={styles.hudValue}>Border projection active</Text>
        </View>
        <View style={styles.hudCard}>
          <Text style={styles.hudKicker}>City center</Text>
          <Text style={styles.hudValue}>{city.name}</Text>
        </View>
      </View>

      <View style={styles.radiusPanel}>
        <Text style={styles.radiusTitle}>Change radius</Text>
        <View style={styles.radiusRow}>
          {RADII.map((value) => (
            <Pressable key={value} onPress={() => setRadiusKm(value)} style={[styles.radiusButton, radiusKm === value && styles.radiusButtonActive]}>
              <Text style={[styles.radiusText, radiusKm === value && styles.radiusTextActive]}>{value} km</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  hudTop: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 10
  },
  hudCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.72)",
    borderWidth: 1,
    borderColor: colors.border
  },
  hudKicker: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 4
  },
  hudValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  radiusPanel: {
    position: "absolute",
    bottom: 96,
    left: 16,
    right: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderWidth: 1,
    borderColor: colors.border
  },
  radiusTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 14
  },
  radiusRow: {
    flexDirection: "row",
    gap: 10
  },
  radiusButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.panel
  },
  radiusButtonActive: {
    backgroundColor: colors.text
  },
  radiusText: {
    color: colors.text,
    fontWeight: "800"
  },
  radiusTextActive: {
    color: colors.whiteButtonText
  },
  marker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.text
  }
});

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#606673" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#16161c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#09090b" }] }
];
