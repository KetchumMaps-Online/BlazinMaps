$(function () {
    'use strict'

    /* Settings. */
	const showSearchMarker = false // Show a marker on the map's scan location. Default: false.
    const isSearchMarkerMovable = false // Let the user move the scan location marker around. Doesn't do anything without --no-fixed-location. Default: false.
    const showLocationMarker = false // Show a marker on the visitor's location. Default: false.
    const isLocationMarkerMovable = false // Let the user move the visitor marker around. Default: false.
	
    const scaleByRarity = true // Enable scaling by rarity. Default: true.
    const upscalePokemon = true // Enable upscaling of certain Pokemon (upscaledPokemon and notify list). Default: false.
    const upscaledPokemon = [] // Add Pokémon IDs separated by commas (e.g. [1, 2, 3]) to upscale icons. Default: []
	
	    const favoriteLocations = [
        {
            'Knoxville': {lat: 35.961437, lng: -83.929213, zoom: 12, deletable: false},
        }
        ]
		
    const map_style = 'style_pgo_day' //  default: 'style_pgo_day'. Options - look at https://github.com/RocketMap/RocketMap/blob/develop/static/data/mapstyle.json
    const playSound = false // Default: false.
    const playCries = false // Default: false.
    const searchMarkerStyle = 'Hidden' //  default: 'pokesition'. Options - look at https://github.com/RocketMap/RocketMap/blob/develop/static/data/searchmarkerstyle.json
    const locationMarkerStyle = 'Hidden' // default: 'mobile'. Options - look at https://github.com/RocketMap/RocketMap/blob/develop/static/data/searchmarkerstyle.json
    const zoomLevel = 16 // default: 16.
	const useGymSidebar = true

    // Google Analytics property ID. Leave empty to disable.
    // Looks like 'UA-XXXXX-Y'.
    const analyticsKey = ''

    // MOTD.
    const motdEnabled = false
    const motdTitle = 'MOTD'
    const motd = 'Hi there! This is an easily customizable MOTD with optional title!'

    // Only show every unique MOTD message once. If disabled, the MOTD will be
    // shown on every visit. Requires support for localStorage.
    // Updating only the MOTD title (and not the text) will not make the MOTD
    // appear again.
    const motdShowOnlyOnce = true

    // What pages should the MOTD be shown on? By default, homepage and mobile
    // pages.
    const motdShowOnPages = [
        '/',
        '/mobile'
    ]

    // Clustering! Different zoom levels for desktop vs mobile.
    const disableClusters = true // Default: false.
    const maxClusterZoomLevel = 14 // Default: 14.
    const maxClusterZoomLevelMobile = 14 // Default: 14.
    const clusterZoomOnClick = false // Default: false.
    const clusterZoomOnClickMobile = false // Default: 14.
    const clusterGridSize = 60 // Default: 60.
    const clusterGridSizeMobile = 60 // Default: 60.

    // Process Pokémon in chunks to improve responsiveness.
    const processPokemonChunkSize = 100 // Default: 100
    const processPokemonIntervalMs = 100 // Default: 100ms
	const processPokemonChunkSizeMobile = 100 // Default: 100.
	const processPokemonIntervalMsMobile = 100 // Default: 100ms.

    /* Feature detection. */

    const hasStorage = (function () {
        var mod = 'RocketMap'
        try {
            localStorage.setItem(mod, mod)
            localStorage.removeItem(mod)
            return true
        } catch (exception) {
            return false
        }
    }())


    /* Do stuff. */

    const currentPage = window.location.pathname
	// Marker cluster might have loaded before custom.js.
    const isMarkerClusterLoaded = typeof window.markerCluster !== 'undefined' && !!window.markerCluster

    // Set custom Store values.
    Store.set('maxClusterZoomLevel', maxClusterZoomLevel)
    Store.set('clusterZoomOnClick', clusterZoomOnClick)
    Store.set('clusterGridSize', clusterGridSize)
    Store.set('processPokemonChunkSize', processPokemonChunkSize)
    Store.set('processPokemonIntervalMs', processPokemonIntervalMs)
    Store.set('scaleByRarity', scaleByRarity)
    Store.set('upscalePokemon', upscalePokemon)
    Store.set('upscaledPokemon', upscaledPokemon)
	Store.set('showSearchMarker', showSearchMarker)
	Store.set('isSearchMarkerMovable', isSearchMarkerMovable)
    Store.set('showLocationMarker', showLocationMarker)
    Store.set('isLocationMarkerMovable', isLocationMarkerMovable)
    Store.set('map_style', map_style)
    Store.set('playSound', playSound)
    Store.set('playCries', playCries)
    Store.set('searchMarkerStyle', searchMarkerStyle)
    Store.set('locationMarkerStyle', locationMarkerStyle)
    Store.set('zoomLevel', zoomLevel)
	Store.set('useGymSidebar', useGymSidebar)
	
	    if (Store.get('favoriteLocations').length === 0) {
        Store.set('favoriteLocations', favoriteLocations)
    }
	
    if (typeof window.orientation !== 'undefined' || isMobileDevice()) {
        Store.set('maxClusterZoomLevel', maxClusterZoomLevelMobile)
        Store.set('clusterZoomOnClick', clusterZoomOnClickMobile)
        Store.set('clusterGridSize', clusterGridSizeMobile)
		Store.set('processPokemonChunkSize', processPokemonChunkSizeMobile)
        Store.set('processPokemonIntervalMs', processPokemonIntervalMsMobile)
    }

    if (disableClusters) {
        Store.set('maxClusterZoomLevel', -1)

        if (isMarkerClusterLoaded) {
            window.markerCluster.setMaxZoom(-1)
        }
    }

    // Google Analytics.
    if (analyticsKey.length > 0) {
        window.ga = window.ga || function () {
            (ga.q = ga.q || []).push(arguments)
        }
        ga.l = Date.now
        ga('create', analyticsKey, 'auto')
        ga('send', 'pageview')
    }

    // Show MOTD.
    if (motdEnabled && motdShowOnPages.indexOf(currentPage) !== -1) {
        let motdIsUpdated = true

        if (hasStorage) {
            const lastMOTD = window.localStorage.getItem('lastMOTD') || ''

            if (lastMOTD === motd) {
                motdIsUpdated = false
            }
        }

        if (motdIsUpdated || !motdShowOnlyOnce) {
            window.localStorage.setItem('lastMOTD', motd)

            swal({
                title: motdTitle,
                text: motd
            })
        }
    }
})
