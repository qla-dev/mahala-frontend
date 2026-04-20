import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polygon, PROVIDER_DEFAULT } from "react-native-maps";
import { BIH_POLYGONS } from "../constants/bihPolygons";
import { colors } from "../constants/theme";
import { projectMaskedCoordinate } from "../utils/map";
import { pointInPolygon } from "../utils/polygon";

export default function MapScreen({ posts, city, onOpenPost }) {
  const [labelsVisible, setLabelsVisible] = useState(true);
  const markers = useMemo(() => {
    if (!city) {
      return [];
    }

    return posts.map((post) => ({
      ...post,
      coordinate: projectMaskedCoordinate(city, post.masked.bearingDeg, post.masked.ringKm)
    }));
  }, [city, posts]);

  const activeZone = useMemo(() => {
    if (!city) {
      return null;
    }

    return BIH_POLYGONS.find((polygon) => pointInPolygon(city, polygon.coordinates, polygon.holes)) || null;
  }, [city]);

  if (!city) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        customMapStyle={mapStyle}
        onRegionChangeComplete={(region) => {
          setLabelsVisible(region.latitudeDelta < 0.45);
        }}
        initialRegion={{
          latitude: city.latitude,
          longitude: city.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08
        }}
      >
        {BIH_POLYGONS.map((polygon) => {
          const active = activeZone?.id === polygon.id;

          return (
            <Polygon
              key={polygon.id}
              coordinates={polygon.coordinates}
              holes={polygon.holes}
              strokeColor={active ? colors.accent : "rgba(255,255,255,0.9)"}
              fillColor={active ? "rgba(139,92,246,0.42)" : "rgba(139,92,246,0.14)"}
              strokeWidth={active ? 3 : 2}
            />
          );
        })}
        {labelsVisible
          ? BIH_POLYGONS.map((polygon) => (
              <Marker key={`${polygon.id}-label`} coordinate={polygon.center} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={[styles.zoneLabel, activeZone?.id === polygon.id && styles.zoneLabelActive]}>
                  <Text style={[styles.zoneLabelText, activeZone?.id === polygon.id && styles.zoneLabelTextActive]}>{polygon.name}</Text>
                </View>
              </Marker>
            ))
          : null}
        {markers.map((post) => (
          <Marker key={post.id} coordinate={post.coordinate} onPress={() => onOpenPost(post)}>
            <View style={[styles.marker, { backgroundColor: post.color }]} />
          </Marker>
        ))}
      </MapView>

      <View style={styles.hudTop}>
        <View style={styles.hudCard}>
          <Text style={styles.hudKicker}>Trenutna zona</Text>
          <Text style={styles.hudValue}>{activeZone?.name || city.name}</Text>
        </View>
        <View style={styles.hudCard}>
          <Text style={styles.hudKicker}>Mahala</Text>
          <Text style={styles.hudValue}>{city.name}</Text>
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
  zoneLabel: {
    maxWidth: 92,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)"
  },
  zoneLabelActive: {
    backgroundColor: colors.accent,
    borderColor: colors.text
  },
  zoneLabelText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center"
  },
  zoneLabelTextActive: {
    color: colors.text
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
  { elementType: "labels.text.fill", stylers: [{ color: "#707789" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#16161c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#09090b" }] }
];
