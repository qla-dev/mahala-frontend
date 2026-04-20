function pointInRing(point, ring) {
  const { latitude, longitude } = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i].latitude;
    const xi = ring[i].longitude;
    const yj = ring[j].latitude;
    const xj = ring[j].longitude;
    const intersects = yi > latitude !== yj > latitude && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function pointInPolygon(point, polygon, holes = []) {
  if (!pointInRing(point, polygon)) {
    return false;
  }

  return !holes.some((hole) => pointInRing(point, hole));
}
