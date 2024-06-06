
const turf = require('@turf/turf');
const fs = require('fs');
const adm2Data = require('../geojson/geoBoundaries-DZA-ADM2.json');
const adm3Data = require('../geojson/geoBoundaries-DZA-ADM3.json');
exports.convertCoordinates = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        // Create GeoJSON Point from coordinates
        const point = turf.point([parseFloat(lng), parseFloat(lat)]);
        let state = null;
        let municipality = null;
        // Search ADM2 polygons for state
        for (const feature of adm2Data.features) {
            if (turf.booleanPointInPolygon(point, feature)) {
                state = feature.properties.shapeName;
                break;
            }
        }
        // Search ADM3 polygons for municipality
        for (const feature of adm3Data.features) {
            if (turf.booleanPointInPolygon(point, feature)) {
                municipality = feature.properties.shapeName;
                break;
            }
        }
        if (state && municipality) {
            res.json({ state, municipality });
        } else {
            res.status(404).json({ error: 'No matching state or municipality found' });
        }
    } catch (e) {
        res.status(500).json({ error: error.message });
    }
}  
