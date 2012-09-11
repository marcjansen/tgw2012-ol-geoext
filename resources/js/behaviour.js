jQuery(function() {
    
    jQuery.deck('.slide');
    
    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
    
    var geographic = new OpenLayers.Projection("EPSG:4326"),
        mercator = new OpenLayers.Projection("EPSG:900913"),
        swissCenterGeogr = new OpenLayers.LonLat(8.2153826,46.79902293),
        swissCenterMerc = swissCenterGeogr.clone().transform(geographic, mercator);

    var map1 = new OpenLayers.Map('ol-formats', {
        allOverlays: true,
        projection: mercator,
        layers: [
            new OpenLayers.Layer.OSM({
                tileOptions: {
                    crossOriginKeyword: null
                }
            }),
            new OpenLayers.Layer.Vector("wfs", {
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    //url:  "http://ows.terrestris.de/geoserver/terrestris/wfs",
                    url: "./resources/data/switzerland.gml.xml",
                    featureType: "world-countries-shape",
                    featureNS: "http://terrestris.de"
                }),
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "iso_a2",
                    value: "CH"
                }),
                projection: geographic,
                style: new OpenLayers.Util.applyDefaults({
                    fillOpacity: 0.3,
                    fillColor: '#ccc',
                    strokeColor: '#d00',
                    strokeWidth: 3,
                    strokeDashstyle: 'solid',
                    label: "Switzerland"
                }, OpenLayers.Feature.Vector.style['default']),
                renderers: ['SVG', 'Canvas', 'VML'] // optional this is the default also
            })
        ],
        controls: [new OpenLayers.Control.Navigation()],
        center: swissCenterMerc,
        zoom: 7
    });
    
    var map2 = new OpenLayers.Map('ol-renderer-canvas', {
        allOverlays: true,
        projection: mercator,
        layers: [
            new OpenLayers.Layer.OSM({
                tileOptions: {
                    crossOriginKeyword: null
                }
            }),
            new OpenLayers.Layer.Vector("wfs", {
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    //url:  "http://ows.terrestris.de/geoserver/terrestris/wfs",
                    url: "./resources/data/switzerland.gml.xml",
                    featureType: "world-countries-shape",
                    featureNS: "http://terrestris.de"
                }),
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "iso_a2",
                    value: "CH"
                }),
                projection: geographic,
                style: new OpenLayers.Util.applyDefaults({
                    fillOpacity: 0.3,
                    fillColor: '#ccc',
                    strokeColor: '#d00',
                    strokeWidth: 3,
                    strokeDashstyle: 'solid',
                    label: "Switzerland"
                }, OpenLayers.Feature.Vector.style['default']),
                renderers: ['Canvas', 'SVG', 'VML']
            })
        ],
        controls: [new OpenLayers.Control.Navigation()],
        center: swissCenterMerc,
        zoom: 7
    });
    
    var map3 = new OpenLayers.Map('ol-vector-style', {
        allOverlays: true,
        projection: mercator,
        layers: [
            new OpenLayers.Layer.OSM({
                tileOptions: {
                    crossOriginKeyword: null
                }
            }),
            new OpenLayers.Layer.Vector("wfs", {
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    //url:  "http://ows.terrestris.de/geoserver/terrestris/wfs",
                    url: "./resources/data/switzerland.gml.xml",
                    featureType: "world-countries-shape",
                    featureNS: "http://terrestris.de"
                }),
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "iso_a2",
                    value: "CH"
                }),
                projection: geographic,
                style: new OpenLayers.Util.applyDefaults({
                    fillOpacity: 0.3,
                    fillColor: '#e0e',
                    strokeColor: '#0e0',
                    strokeWidth: 5,
                    strokeDashstyle: 'solid',
                    labelOutlineColor: 'orange',
                    labelOutlineWidth: 4,
                    fontColor: '#e00',
                    fontFamily: 'Squealer Embossed',
                    label: "Switzerland"
                }, OpenLayers.Feature.Vector.style['default'])
            })
        ],
        controls: [new OpenLayers.Control.Navigation()],
        center: swissCenterMerc,
        zoom: 7
    });
    
    // ol-vector-simplified,
    var map4 = new OpenLayers.Map('ol-vector-simplified', {
        allOverlays: true,
        projection: mercator,
        layers: [
            new OpenLayers.Layer.OSM({
                tileOptions: {
                    crossOriginKeyword: null
                }
            }),
            new OpenLayers.Layer.Vector("wfs", {
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    //url:  "http://ows.terrestris.de/geoserver/terrestris/wfs",
                    url: "./resources/data/switzerland.gml.xml",
                    featureType: "world-countries-shape",
                    featureNS: "http://terrestris.de"
                }),
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "iso_a2",
                    value: "CH"
                }),
                projection: geographic,
                styleMap: new OpenLayers.StyleMap({
                    'default': new OpenLayers.Util.applyDefaults({
                        title: 'asdsd',
                        fillOpacity: 0.3,
                        fillColor: '#ccc',
                        strokeColor: '#d00',
                        strokeWidth: 3,
                        strokeDashstyle: 'solid'
                        //label: "Switzerland"
                    }, OpenLayers.Feature.Vector.style['default']),
                    'select': new OpenLayers.Util.applyDefaults({
                        fillOpacity: 0.3,
                        fillColor: '#00e',
                        strokeColor: '#00e',
                        strokeWidth: 3,
                        strokeDashstyle: 'solid'
                        //label: "Switzerland (selected)"
                    }, OpenLayers.Feature.Vector.style['select'])
                })
            })
        ],
        controls: [new OpenLayers.Control.Navigation()],
        center: swissCenterMerc,
        zoom: 7
    });
    
    /**
     * small helper method for simplification
     * 
     * @param {Object} evt
     */
    var simplify = function(evt){
        if (map4.layers[1].features.length >=2 ) {
            map4.layers[1].events.unregister('featureadded', map4, simplify);
        }
        var points = evt.feature.geometry.getVertices();
        updateInfo(evt.feature.geometry, 'before');
        updateInfo(evt.feature.geometry, 'after');
        var ls = new OpenLayers.Geometry.LineString(points).simplify(10000);
        map4.layers[1].addFeatures([new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.MultiPolygon(
                new OpenLayers.Geometry.Polygon(
                    new  OpenLayers.Geometry.LinearRing(ls.getVertices())
                )
            )
        )], null, new OpenLayers.Style(new OpenLayers.Util.applyDefaults({
            fill: false,
            strokeColor: '#f00',
            strokeWidth: 5,
            strokeDashstyle: 'solid'
        }, OpenLayers.Feature.Vector.style['default'])));
        map4.layers[1].removeFeatures([map4.layers[1].features[0]]);
    };
    
    /**
     * @param {Object} geom
     * @param {Object} whichOne
     */
    var updateInfo = function(geom, whichOne) {

        var verticesCnt = geom.getVertices().length;
        var length = geom.getLength();
        
        $('#vertices-' + whichOne).text(' ' + verticesCnt);
        $('#length-' + whichOne).text(' ' + (length / 1000).toFixed(1) + ' km');
    };
    
    /**
     * @param {Object} feature
     */
    var updateExports = function(feature) {
        var kml = (new OpenLayers.Format.KML()).write(feature),
            geojson = (new OpenLayers.Format.GeoJSON()).write(feature);
        $('#kml-out textarea').text(kml);
        $('#geojson-out textarea').text(geojson);
    };
    
    map4.layers[1].events.register('featureadded', map4, simplify);
    
    map4.layers[1].events.register('afterfeaturemodified', map4, function(evt){
        updateInfo(evt.feature.geometry, 'after');
        updateExports(evt.feature);
    });
    map4.addControl(new OpenLayers.Control.ModifyFeature(map4.layers[1], {
        autoActivate: true
    }));
});
