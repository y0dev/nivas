// Function to hide the alert
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// Function to show the alert
export const showAlert = (type, msg) => {
  hideAlert();

  const markup = `
    <div class="alert alert--${type}">
      <span class="alert__content">${msg}</span>
      <span class="alert__close" onclick="hideAlert()">&#10006;</span>
    </div>
  `;
  
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

// let map;

/**
 * Initialize the map and draw a circle with the given radius around the coordinates
 * @param {Object} coordinates - The center of the circle
 * @param {number} coordinates.lat - The latitude of the center
 * @param {number} coordinates.lng - The longitude of the center
 * @param {number} radius - The radius of the circle in meters
 */
export function showMap(coordinates, radius = 1000) {
  const mapElement = document.getElementById('map');

  if (!mapElement) {
    console.error('Map element not found');
    return;
  }

  let circle;
  // Draw the circle
  circle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map,
    center: { lat: coordinates.lat, lng: coordinates.lng },
    radius: radius,
  });
}

/**
 * Update the position and radius of the circle on the map
 * @param {Object} coordinates - The new center of the circle
 * @param {number} coordinates.lat - The latitude of the new center
 * @param {number} coordinates.lng - The longitude of the new center
 * @param {number} radius - The new radius of the circle in meters
 */
export function updateMap(coordinates, radius = 1000) {
  const mapElement = document.getElementById('map');
  console.log(coordinates);
  if (!mapElement) {
    console.error('Map element not found');
    return;
  }

  let map = new google.maps.Map(mapElement, {
    center: { lat: coordinates.lat, lng: coordinates.lng },
    zoom: 20,
  });

  // Draw the circle
  let circle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map,
    center: { lat: coordinates.lat, lng: coordinates.lng },
    radius: radius,
  });

  if (map && circle) {
    // Update the circle's center and radius
    circle.setCenter(new google.maps.LatLng(coordinates.lat, coordinates.lng));
    circle.setRadius(radius);

    // Optionally update the map's center
    map.setCenter(new google.maps.LatLng(coordinates.lat, coordinates.lng));
  } else {
    console.error("Map or circle is not initialized. Call showMap first.");
  }
}

// Function to show the overlay
export function showSpinner() {
  const overlay = document.getElementById('overlay');
  overlay.classList.remove('hidden');
}

// Function to hide the overlay
export function hideSpinner() {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('hidden');
}

// Example usage:
// showMap({ lat: 40.730610, lng: -73.935242 }, 1500);
// updateMap({ lat: 34.052235, lng: -118.243683 }, 2000);
