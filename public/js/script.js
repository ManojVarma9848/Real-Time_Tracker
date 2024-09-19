const socket = io();

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Position updated:", latitude, longitude); // Log position
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error); // Log error
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

const map = L.map("map").setView([0, 0], 2); // Set initial view to a global center
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Manoj's Tracker"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // If the marker for this ID already exists, update its position
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // If it doesn't exist, create a new marker
        const marker = L.marker([latitude, longitude]).addTo(map);
        markers[id] = marker; // Store the marker with the associated ID
    }

    // Optionally set the map view to the latest location
    map.setView([latitude, longitude], 16);
});
socket.on("user-disconnected",(id)=>{
    map.removeLayer(markers[id]);
    delete markers[id];
})
