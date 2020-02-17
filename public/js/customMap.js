L.custom = {
    init: function (obj, params) { // this method is run as soon as the core loading process is loaded

        window.map = L.map(obj, {
            center: [48, 4],
            zoom: 3,
            background: "osmec"
        });

    }
}
