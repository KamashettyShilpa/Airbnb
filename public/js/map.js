   mapboxgl.accessToken = mapToken;
   console.log(mapToken);
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12',
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
  });
  console.log(listing.geometry.coordinates);
  // const marker1 = new mapboxgl.Marker()
  // .setLngLat(listing.geometry.coordinates)
  // .setPopup(
  //   new mapboxgl.Popup({offset: 25, className: 'my-class'})
  //   .setHTML(`<h4>${listing.location}</h4><p>Exact listing location</p>`))
  //   .addTo(map);
//==========================================================
   map.on('load', () => {
      // Load an image from an external URL.
      map.loadImage(
         'https://img.icons8.com/?size=80&id=j9z5XK2udFGv&format=png',
      (error, image) => {
      if (error) throw error;
       
      // Add the image to the map style.
      map.addImage('cat', image);
       
      // Add a data source containing one point feature.
      map.addSource('point', {
      'type': 'geojson',
      'data': {
      'type': 'FeatureCollection',
      'features': [
      {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': listing.geometry.coordinates,
      }
      }
      ]
      }
      });
       
      // Add a layer to use the image to represent the data.
      map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'point', // reference the data source
      'layout': {
      'icon-image': 'cat', // reference the image
      'icon-size': 0.55
      }
      })
      }
      );
      // Add a popup when the user clicks on a point.
      map.on('click', 'points', function (e) {
         var coordinates = e.features[0].geometry.coordinates.slice();
         var description = `<h4>${listing.location}</h4><p>Exact location of the listing!<p>`;

         // Ensure that if the map is zoomed out such that multiple
         // copies of the feature are visible, the popup appears
         // over the copy being pointed to.
         while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
         }

         new mapboxgl.Popup()
         .setLngLat(coordinates)
         .setHTML(description)
         .addTo(map);
 });
      });


      
