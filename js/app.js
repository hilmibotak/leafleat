const API_URL = 'https://web-production-233db.up.railway.app';

// Initialize map
const map = L.map('map').setView([-6.2, 106.816666], 10);

// Add tile layer with better styling
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Store markers and locations
let markers = [];
let locations = [];
let selectedLatLng = null;

// Custom marker icon
const customIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// DOM Elements
const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('locationModal');
const locationForm = document.getElementById('locationForm');
const locationsList = document.getElementById('locationsList');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const addLocationBtn = document.getElementById('addLocationBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const mapElement = document.getElementById('map');

// Fetch and display all locations
function fetchLocations() {
    locationsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading locations...</p></div>';
    
    fetch(`${API_URL}/api/locations`)
        .then(response => response.json())
        .then(data => {
            locations = data;
            displayLocations(data);
            displayMarkers(data);
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
            locationsList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load locations</p></div>';
            showToast('Failed to load locations', 'error');
        });
}

// Display locations in sidebar
function displayLocations(data) {
    if (data.length === 0) {
        locationsList.innerHTML = '<div class="empty-state"><i class="fas fa-map-marker-alt"></i><p>No locations yet. Click on the map to add one!</p></div>';
        return;
    }

    locationsList.innerHTML = data.map(location => `
        <div class="location-item" data-id="${location._id}" data-lat="${location.lat}" data-lng="${location.lng}">
            <h3><i class="fas fa-map-pin"></i> ${location.name}</h3>
            <p>${location.description}</p>
            <div class="coordinates">
                <span><i class="fas fa-compass"></i> ${location.lat.toFixed(6)}</span>
                <span><i class="fas fa-compass"></i> ${location.lng.toFixed(6)}</span>
            </div>
            <button class="delete-btn" onclick="deleteLocation('${location._id}', event)">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `).join('');

    // Add click event to location items
    document.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('delete-btn') && !e.target.closest('.delete-btn')) {
                const lat = parseFloat(this.dataset.lat);
                const lng = parseFloat(this.dataset.lng);
                map.setView([lat, lng], 15);
                
                // Find and open marker popup
                markers.forEach(marker => {
                    if (marker.getLatLng().lat === lat && marker.getLatLng().lng === lng) {
                        marker.openPopup();
                    }
                });
            }
        });
    });
}

// Display markers on map
function displayMarkers(data) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    data.forEach(location => {
        const marker = L.marker([location.lat, location.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
                <div style="min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; color: #3b82f6; font-size: 16px;">
                        <i class="fas fa-map-marker-alt"></i> ${location.name}
                    </h3>
                    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">${location.description}</p>
                    <div style="font-size: 12px; color: #94a3b8;">
                        <div><i class="fas fa-compass"></i> Lat: ${location.lat.toFixed(6)}</div>
                        <div><i class="fas fa-compass"></i> Lng: ${location.lng.toFixed(6)}</div>
                    </div>
                </div>
            `);
        markers.push(marker);
    });
}

// Add click event to map for adding new location
map.on('click', function(e) {
    selectedLatLng = e.latlng;
    document.getElementById('locationLat').value = e.latlng.lat.toFixed(6);
    document.getElementById('locationLng').value = e.latlng.lng.toFixed(6);
    openModal();
});

// Open modal
function openModal() {
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    locationForm.reset();
    selectedLatLng = null;
}

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('hidden');
    mapElement.classList.toggle('expanded');
}

// Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast show';
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Submit form to add location
locationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('locationName').value;
    const description = document.getElementById('locationDescription').value;
    const lat = parseFloat(document.getElementById('locationLat').value);
    const lng = parseFloat(document.getElementById('locationLng').value);

    fetch(`${API_URL}/api/locations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, lat, lng })
    })
    .then(response => response.json())
    .then(data => {
        closeModal();
        fetchLocations();
        showToast('Location added successfully!');
    })
    .catch(error => {
        console.error('Error adding location:', error);
        showToast('Failed to add location', 'error');
    });
});

// Delete location
function deleteLocation(id, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this location?')) {
        fetch(`${API_URL}/api/locations/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            fetchLocations();
            showToast('Location deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting location:', error);
            showToast('Failed to delete location', 'error');
        });
    }
}

// Search locations
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredLocations = locations.filter(location => 
        location.name.toLowerCase().includes(searchTerm) || 
        location.description.toLowerCase().includes(searchTerm)
    );
    displayLocations(filteredLocations);
});

// Event listeners
toggleSidebarBtn.addEventListener('click', toggleSidebar);
closeSidebarBtn.addEventListener('click', toggleSidebar);
addLocationBtn.addEventListener('click', () => {
    if (!selectedLatLng) {
        showToast('Please click on the map to select a location', 'error');
    } else {
        openModal();
    }
});
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize
fetchLocations();