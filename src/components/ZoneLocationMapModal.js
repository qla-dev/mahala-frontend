import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Circle, Marker, Polygon, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle as SvgCircle, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BIH_POLYGONS } from "../constants/bihPolygons";
import { colors } from "../constants/theme";
import { pointInPolygon } from "../utils/polygon";

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const SUCCESS_CIRCLE_LENGTH = 226;
const MIN_ZONE_POINTS = 3;
const RECOMMENDED_ZONE_POINTS = 6;

const BOSNIA_REGION = {
  latitude: 44.165,
  longitude: 17.79,
  latitudeDelta: 3.5,
  longitudeDelta: 4.8
};

export default function ZoneLocationMapModal({ visible, onClose, onLocated }) {
  const mapRef = useRef(null);
  const lastMapPressAt = useRef(0);
  const insets = useSafeAreaInsets();
  const [locating, setLocating] = useState(false);
  const [userCoordinate, setUserCoordinate] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [drawingActive, setDrawingActive] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState([]);
  const [savedCoordinates, setSavedCoordinates] = useState([]);
  const [finishingDrawing, setFinishingDrawing] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [message, setMessage] = useState("Dodirni Lociraj me da pronadjemo u kojem si BIH poligonu.");
  const successProgress = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.82)).current;

  useEffect(() => {
    if (!visible) {
      setLocating(false);
      setUserCoordinate(null);
      setSelectedPolygon(null);
      setDrawingActive(false);
      setDrawnCoordinates([]);
      setSavedCoordinates([]);
      setFinishingDrawing(false);
      setZoneName("");
      setSuccessOpen(false);
      setLabelsVisible(false);
      setMessage("Dodirni Lociraj me da pronadjemo u kojem si BIH poligonu.");
      successProgress.setValue(0);
      successScale.setValue(0.82);
    }
  }, [successProgress, successScale, visible]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const flyToCoordinate = (coordinate) => {
    mapRef.current?.animateToRegion(
      {
        ...coordinate,
        latitudeDelta: 0.55,
        longitudeDelta: 0.55
      },
      700
    );

    setTimeout(() => {
      mapRef.current?.animateToRegion(
        {
          ...coordinate,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045
        },
        950
      );
    }, 720);
  };

  const locateUser = async () => {
    setLocating(true);
    setMessage("Trazimo tvoju tacnu lokaciju...");

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setMessage("Lokacija nije dozvoljena. Ukljuci dozvolu za lokaciju pa pokusaj opet.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      const coordinate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      const polygon = BIH_POLYGONS.find((item) => pointInPolygon(coordinate, item.coordinates, item.holes));

      setUserCoordinate(coordinate);
      setSelectedPolygon(polygon || null);
      setDrawingActive(true);
      setDrawnCoordinates([]);
      flyToCoordinate(coordinate);

      setMessage(polygon ? `Nacrtaj svoju zonu unutar: ${polygon.name}. Dodaj vise tacaka za precizniju granicu.` : "Nacrtaj svoju zonu. Dodirni mapu da postavis tacke granice.");
    } catch (error) {
      setMessage("Nismo uspjeli pronaci lokaciju. Provjeri GPS i pokusaj opet.");
    } finally {
      setLocating(false);
    }
  };

  const confirmLocation = () => {
    if (drawnCoordinates.length < MIN_ZONE_POINTS) {
      return;
    }

    const plainCoordinates = drawnCoordinates.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude
      }));

    setFinishingDrawing(true);
    setDrawingActive(false);
    setSavedCoordinates(plainCoordinates);
    setMessage("Granica je sacuvana. Dodaj naziv zone i posalji zahtjev.");
  };

  const submitDrawnZone = () => {
    setSuccessOpen(true);
    setFinishingDrawing(false);
    setMessage("Zahtjev uspjesno poslan.");
    successProgress.setValue(0);
    successScale.setValue(0.82);
    Animated.parallel([
      Animated.timing(successProgress, {
        toValue: 1,
        duration: 760,
        useNativeDriver: false
      }),
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true
      })
    ]).start();

    setTimeout(() => {
      onLocated({
        name: zoneName.trim(),
        baseZone: selectedPolygon?.name || null,
        coordinates: savedCoordinates
      });
    }, 1200);
  };

  const handleMapPress = (event) => {
    if (!drawingActive || locating || finishingDrawing) {
      return;
    }

    const now = Date.now();
    if (now - lastMapPressAt.current < 260) {
      return;
    }
    lastMapPressAt.current = now;

    const coordinate = event.nativeEvent.coordinate;
    setDrawnCoordinates((prev) => {
      const next = [...prev, coordinate];
      const nextCount = next.length;
      setMessage(
        nextCount >= RECOMMENDED_ZONE_POINTS
          ? "Super. Mozes dodati jos tacaka za detalje ili zavrsiti crtanje."
          : nextCount >= MIN_ZONE_POINTS
            ? `Moze se zavrsiti, ali za realniju mahalu dodaj jos koju tacku.`
            : "Dodaj jos tacaka da zatvorimo tvoju zonu."
      );
      return next;
    });
  };

  const undoPoint = () => {
    setDrawnCoordinates((prev) => prev.slice(0, -1));
  };

  const clearDrawing = () => {
    setDrawnCoordinates([]);
    setMessage(selectedPolygon ? `Nacrtaj svoju zonu unutar: ${selectedPolygon.name}. Dodaj vise tacaka za precizniju granicu.` : "Nacrtaj svoju zonu. Dodirni mapu da postavis tacke granice.");
  };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.wrap}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFill}
          customMapStyle={mapStyle}
          initialRegion={BOSNIA_REGION}
          onPress={handleMapPress}
          onRegionChangeComplete={(region) => {
            setLabelsVisible(region.latitudeDelta < 0.45);
          }}
          showsUserLocation
        >
          {BIH_POLYGONS.map((polygon) => {
            const active = selectedPolygon?.id === polygon.id;

            return (
              <Polygon
                key={polygon.id}
                coordinates={polygon.coordinates}
                holes={polygon.holes}
                strokeColor={active ? colors.accent : "rgba(255,255,255,0.9)"}
                fillColor={active ? "rgba(139,92,246,0.44)" : "rgba(139,92,246,0.16)"}
                strokeWidth={active ? 4 : 2}
                tappable={!drawingActive && !finishingDrawing && !successOpen}
                onPress={() => {
                  if (drawingActive || finishingDrawing || successOpen) {
                    return;
                  }

                  setSelectedPolygon(polygon);
                  setMessage(`Odabrana zona: ${polygon.name}`);
                  mapRef.current?.animateToRegion(
                    {
                      ...polygon.center,
                      latitudeDelta: 0.16,
                      longitudeDelta: 0.16
                    },
                    450
                  );
                }}
              />
            );
          })}
          {labelsVisible
            ? BIH_POLYGONS.map((polygon) => {
                const active = selectedPolygon?.id === polygon.id;

                return (
                  <Marker key={`${polygon.id}-label`} coordinate={polygon.center} anchor={{ x: 0.5, y: 0.5 }}>
                    <View style={[styles.zoneLabel, active && styles.zoneLabelActive]}>
                      <Text style={[styles.zoneLabelText, active && styles.zoneLabelTextActive]}>{polygon.name}</Text>
                    </View>
                  </Marker>
                );
              })
            : null}
          {drawnCoordinates.length > 0 ? (
            <Polyline coordinates={drawnCoordinates} strokeColor={colors.success} strokeWidth={10} lineCap="round" lineJoin="round" zIndex={21} />
          ) : null}
          {drawnCoordinates.length > 2 ? (
            <Polygon coordinates={drawnCoordinates} strokeColor={colors.success} fillColor="rgba(16,185,129,0.22)" strokeWidth={4} />
          ) : null}
          {drawnCoordinates.map((coordinate, index) => (
            <Circle
              key={`draw-point-${index}`}
              center={coordinate}
              radius={18}
              strokeColor={colors.text}
              fillColor={colors.success}
              strokeWidth={3}
              zIndex={22}
            />
          ))}
          {userCoordinate ? (
            <Marker coordinate={userCoordinate}>
              <View style={styles.userMarker}>
                <Ionicons name="location" size={18} color={colors.text} />
              </View>
            </Marker>
          ) : null}
        </MapView>

        <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 22) }]}>
          <Pressable onPress={onClose} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Lokacija zone</Text>
          <View style={styles.headerButton} />
        </View>

        <View
          style={[
            styles.bottomPanel,
            {
              bottom: keyboardHeight > 0 ? Math.max(10, keyboardHeight - insets.bottom + 10) : 0,
              paddingBottom: Math.max(insets.bottom + 16, 22)
            }
          ]}
        >
          <Text style={styles.panelTitle}>{finishingDrawing ? "Granica sacuvana" : drawingActive ? "Nacrtaj svoju zonu" : selectedPolygon ? selectedPolygon.name : "BIH poligoni"}</Text>
          <Text style={styles.panelCopy}>{message}</Text>
          {successOpen ? (
            <MapSuccessState progress={successProgress} scale={successScale} />
          ) : finishingDrawing ? (
            <>
              <TextInput
                value={zoneName}
                onChangeText={setZoneName}
                placeholder="Naziv tvoje zone"
                placeholderTextColor={colors.subdued}
                style={styles.nameInput}
              />
              <Pressable disabled={!zoneName.trim()} onPress={submitDrawnZone} style={[styles.confirmButton, !zoneName.trim() && styles.buttonDisabled]}>
                <Text style={styles.confirmText}>Posalji zahtjev</Text>
              </Pressable>
            </>
          ) : drawingActive ? (
            <>
              <View style={styles.drawActions}>
                <Pressable disabled={drawnCoordinates.length === 0} onPress={undoPoint} style={[styles.drawButton, drawnCoordinates.length === 0 && styles.buttonDisabled]}>
                  <Text style={styles.drawButtonText}>Nazad tacka</Text>
                </Pressable>
                <Pressable disabled={drawnCoordinates.length === 0} onPress={clearDrawing} style={[styles.drawButton, drawnCoordinates.length === 0 && styles.buttonDisabled]}>
                  <Text style={styles.drawButtonText}>Ocisti</Text>
                </Pressable>
              </View>
              <Text style={styles.pointHint}>{drawnCoordinates.length} tacaka dodano. Preporuka: najmanje {RECOMMENDED_ZONE_POINTS} za prirodniju granicu.</Text>
              <Pressable disabled={drawnCoordinates.length < MIN_ZONE_POINTS} onPress={confirmLocation} style={[styles.confirmButton, drawnCoordinates.length < MIN_ZONE_POINTS && styles.buttonDisabled]}>
                <Text style={styles.confirmText}>{drawnCoordinates.length < MIN_ZONE_POINTS ? `${drawnCoordinates.length} tacaka` : "Zavrsi crtanje"}</Text>
              </Pressable>
            </>
          ) : (
            <Pressable disabled={locating} onPress={locateUser} style={[styles.locateButton, locating && styles.buttonDisabled]}>
              {locating ? <ActivityIndicator color={colors.text} /> : <Ionicons name="locate" size={18} color={colors.text} />}
              <Text style={styles.locateText}>{locating ? "Lociram..." : "Lociraj me"}</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function MapSuccessState({ progress, scale }) {
  const circleOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SUCCESS_CIRCLE_LENGTH, 0]
  });
  const checkOffset = progress.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [54, 54, 0]
  });

  return (
    <View style={styles.mapSuccessWrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Svg width={70} height={70} viewBox="0 0 92 92">
          <AnimatedCircle
            cx="46"
            cy="46"
            r="36"
            stroke={colors.success}
            strokeWidth="7"
            fill="rgba(16,185,129,0.12)"
            strokeLinecap="round"
            strokeDasharray={`${SUCCESS_CIRCLE_LENGTH} ${SUCCESS_CIRCLE_LENGTH}`}
            strokeDashoffset={circleOffset}
            rotation="-90"
            origin="46, 46"
          />
          <AnimatedPath
            d="M30 47.5L41 58.5L64 34.5"
            stroke={colors.success}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="54 54"
            strokeDashoffset={checkOffset}
          />
        </Svg>
      </Animated.View>
      <Text style={styles.mapSuccessText}>Zahtjev uspjesno poslan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.72)"
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)"
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  bottomPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(5,5,5,0.92)",
    borderWidth: 1,
    borderColor: colors.border
  },
  panelTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6
  },
  panelCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
    marginBottom: 14
  },
  locateButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  locateText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  confirmButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  confirmText: {
    color: colors.whiteButtonText,
    fontSize: 14,
    fontWeight: "900"
  },
  buttonDisabled: {
    opacity: 0.75
  },
  userMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center"
  },
  drawPoint: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center"
  },
  drawPointText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900"
  },
  drawActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10
  },
  drawButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  drawButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900"
  },
  pointHint: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center"
  },
  savedState: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "rgba(16,185,129,0.14)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.45)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10
  },
  savedText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900"
  },
  mapSuccessWrap: {
    minHeight: 100,
    borderRadius: 18,
    backgroundColor: "rgba(16,185,129,0.12)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.42)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  mapSuccessText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  nameInput: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10
  },
  zoneLabel: {
    maxWidth: 92,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.76)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)"
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
  }
});

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#686f80" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#17171d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#09090b" }] }
];
