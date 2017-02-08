var seatGauge = {
    "chart": {
        "type": "solidgauge",
    },
    "title": {
        "text": "Seats filled"
    },
    "subtitle": {
        "text": "90 available"
    },
    "pane": {
        "center": [
            "50%",
            "85%"
        ],
        "size": "140%",
        "startAngle": "-90",
        "endAngle": "90",
        "background": {
            "backgroundColor": "#EEE",
            "innerRadius": "60%",
            "outerRadius": "100%",
            "shape": "arc"
        }
    },
    "tooltip": {
        "enabled": true
    },
    "yAxis": {
        "stops": [
            [
                0.1,
                "#DF5353"
            ],
            [
                0.5,
                "#DDDF0D"
            ],
            [
                0.9,
                "#55BF3B"
            ]
        ],
        "min": 0,
        "max": 108,
        "lineWidth": 0,
        "tickPixelInterval": null,
        "tickWidth": 0,
        "title": {
            "y": -70,
            "text": null
        },
        "labels": {
            "y": 16
        }
    },
    "plotOptions": {
        "solidgauge": {
            "dataLabels": {
                "borderWidth": 0,
                "useHTML": true
            }
        }
    },
    "series": [{
        "dataLabels": {
            "format": "<div style=\"text-align:center\"><span style=\"font-size:25px;color:#000000\">{y}</span></div>"
        },
        "index": 0,
        "name": "Seats filled",
        "data": [
            []
        ]
    }],
    "legend": {
        "enabled": false
    },
    "credits": {
        "enabled": false
    },
    "xAxis": {
        "type": "category"
    }
};

var partiesGauge = {
    chart: {
        backgroundColor: 'rgba(255,255,255,0)',
    },
    title: {
        text: 'Seats won',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                align: 'left',
                enabled: true,
                style: {
                    color: 'black'
                }
            },
            "center": ["50%", "85%"],
            "size": "140%",
            "startAngle": -90,
            "endAngle": 90,
        }
    },
    series: [{
        type: 'pie',
        name: 'Seats',
        innerSize: '50%',
        data: [{
            name: 'Not yet declared',
            y: 108,
            color: 'rgba(255,255,255,0)',
            dataLabels: {
                enabled: false
            }
        }]
    }],
    credits: {
        enabled: false
    },
};
