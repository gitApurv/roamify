import { useState, useEffect } from "react";
import { useControl, Marker } from "react-map-gl/maplibre";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

const geocoderApi = {
  forwardGeocode: async ({ query }) => {
    const features = [];
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&polygon_geojson=1&addressdetails=1&limit=10`;
      const response = await fetch(url);
      const geojson = await response.json();

      if (!geojson.features || geojson.features.length === 0) {
        console.warn("No results from geocoder");
        return { features: [] };
      }

      geojson.features.forEach((f) => {
        try {
          // Nominatim returns bbox as [minLon, minLat, maxLon, maxLat]
          const [minLon, minLat, maxLon, maxLat] = f.bbox || [f.properties.lon, f.properties.lat, f.properties.lon, f.properties.lat];
          const lon = (minLon + maxLon) / 2;
          const lat = (minLat + maxLat) / 2;

          features.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat] },
            place_name: f.properties.display_name || f.properties.name,
            text: f.properties.display_name || f.properties.name,
            place_type: ["place"],
            properties: f.properties,
            center: [lon, lat],
            bbox: f.bbox,
          });
        } catch (itemError) {
          console.error("Error processing feature:", itemError);
        }
      });
    } catch (e) {
      console.error("Geocoding failed:", e);
    }
    return { features };
  },
};

export default function GeocoderControl(props) {
  const [marker, setMarker] = useState(null);

  const geocoder = useControl(
    ({ mapLib }) => {
      const ctrl = new MaplibreGeocoder(geocoderApi, {
        ...props,
        marker: false,
        maplibregl: mapLib,
      });

      const events = ["loading", "results", "error"];
      events.forEach((ev) => {
        if (
          typeof props[`on${ev[0].toUpperCase() + ev.slice(1)}`] === "function"
        ) {
          ctrl.on(ev, props[`on${ev[0].toUpperCase() + ev.slice(1)}`]);
        }
      });

      if (typeof props.onResult === "function") {
        ctrl.on("result", (evt) => {
          props.onResult(evt);
          const { result } = evt;
          const location =
            result?.center ??
            (result.geometry?.type === "Point" && result.geometry.coordinates);

          if (location && props.marker) {
            const markerProps =
              typeof props.marker === "object" ? props.marker : {};
            setMarker(
              <Marker
                longitude={location[0]}
                latitude={location[1]}
                {...markerProps}
              />
            );
          } else {
            setMarker(null);
          }
        });
      }

      return ctrl;
    },
    { position: props.position }
  );

  // Handle clear button visibility
  useEffect(() => {
    const input = document.querySelector(".maplibregl-ctrl-geocoder--input");
    const clearButton = document.querySelector(".maplibregl-ctrl-geocoder--button");

    if (!input || !clearButton) return;

    const updateButtonVisibility = () => {
      if (input.value.trim()) {
        clearButton.style.setProperty("opacity", "1", "important");
        clearButton.style.setProperty("visibility", "visible", "important");
      } else {
        clearButton.style.setProperty("opacity", "0", "important");
        clearButton.style.setProperty("visibility", "hidden", "important");
      }
    };

    // Update on input change and after button click
    input.addEventListener("input", updateButtonVisibility);
    input.addEventListener("change", updateButtonVisibility);
    clearButton.addEventListener("click", () => {
      setTimeout(updateButtonVisibility, 50);
    });

    // Initial check
    updateButtonVisibility();

    return () => {
      input.removeEventListener("input", updateButtonVisibility);
      input.removeEventListener("change", updateButtonVisibility);
    };
  }, [geocoder]);

  if (geocoder._map) {
    const setters = {
      proximity: "setProximity",
      render: "setRenderFunction",
      language: "setLanguage",
      zoom: "setZoom",
      flyTo: "setFlyTo",
      placeholder: "setPlaceholder",
      countries: "setCountries",
      types: "setTypes",
      minLength: "setMinLength",
      limit: "setLimit",
      filter: "setFilter",
    };

    Object.entries(setters).forEach(([prop, setter]) => {
      if (
        props[prop] !== undefined &&
        geocoder[`get${setter.slice(3)}`]() !== props[prop]
      ) {
        geocoder[setter](props[prop]);
      }
    });
  }

  return marker;
}

GeocoderControl.defaultProps = {
  marker: true,
  onLoading: () => { },
  onResults: () => { },
  onResult: () => { },
  onError: () => { },
};

