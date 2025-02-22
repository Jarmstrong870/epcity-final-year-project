// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Mock Google Maps API to avoid test failures
Cypress.on('window:before:load', (win) => {
    win.google = {
        maps: {
            Size: class {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                }
            },
            Map: class {},
            Marker: class {},
            LatLng: class {
                constructor(lat, lng) {
                    this.lat = () => lat;
                    this.lng = () => lng;
                }
            },
            Geocoder: class {
                geocode(request, callback) {
                    callback([{ formatted_address: 'Mocked Address' }], 'OK');
                }
            },
            places: {
                Autocomplete: class {},
            },
        },
    };
});
