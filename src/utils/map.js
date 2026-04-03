export function projectMaskedCoordinate(center, bearingDeg, ringKm) {
  const radius = ringKm * 111320;
  const angle = (bearingDeg * Math.PI) / 180;
  const lat = center.latitude + (radius / 111320) * Math.cos(angle);
  const lng = center.longitude + (radius / (111320 * Math.cos((center.latitude * Math.PI) / 180))) * Math.sin(angle);

  return {
    latitude: lat,
    longitude: lng
  };
}
