const API_URL = 'https://backend-leafleat-42ti8f7nz-hilmiromadoni-4647s-projects.vercel.app';

const map = L.map('map').setView([-6.2, 106.816666], 10); // Jakarta coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch locations from backend and add markers
fetch(`${API_URL}/api/locations`)
    .then(response => response.json())
    .then(data => {
        data.forEach(location => {
            L.marker([location.lat, location.lng]).addTo(map)
                .bindPopup(`<b>${location.name}</b><br>${location.description}`);
        });
    })
    .catch(error => console.error('Error fetching locations:', error));

// Add click event to add new location
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const name = prompt('Enter location name:');
    const description = prompt('Enter description:');
    if (name && description) {
        fetch(`${API_URL}/api/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, lat, lng })
        })
        .then(response => response.json())
        .then(data => {
            L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${data.name}</b><br>${data.description}`);
        });
    }
});