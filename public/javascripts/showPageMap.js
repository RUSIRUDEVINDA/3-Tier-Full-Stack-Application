const mapContainer = document.querySelector('#map');
const mapToken = mapContainer.dataset.mapToken;
const campground = JSON.parse(mapContainer.dataset.campground);

const map = new maplibregl.Map({
    container: mapContainer,
    style: 'https://api.maptiler.com/maps/streets/style.json?key=' + mapToken, // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new maplibregl.NavigationControl());


new maplibregl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maplibregl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)
