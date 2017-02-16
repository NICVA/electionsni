Vue.use(VueHighcharts)

var partiesArr = [{
    "Party_Id": "19",
    "Party_Name": "Alliance Party",
    "Party_Abbreviation": "APNI",
    "Hex_Col": "#ffe600",
    "DClub_Id": "party:103"
}, {
    "Party_Id": "20",
    "Party_Name": "Democratic Unionist Party",
    "Party_Abbreviation": "DUP",
    "Hex_Col": "#ff8000",
    "DClub_Id": "party:70"
}, {
    "Party_Id": "111",
    "Party_Name": "Green Party",
    "Party_Abbreviation": "GPNI",
    "Hex_Col": "#33ff33",
    "DClub_Id": "party:305"
}, {
    "Party_Id": "21",
    "Party_Name": "Independent",
    "Party_Abbreviation": "IND",
    "Hex_Col": "#669999",
    "DClub_Id": "ynmp-party:2"
}, {
    "Party_Id": "24",
    "Party_Name": "Sinn Fein",
    "Party_Abbreviation": "SF",
    "Hex_Col": "#009900",
    "DClub_Id": "party:39"
}, {
    "Party_Id": "23",
    "Party_Name": "Social Democratic and Labour Party",
    "Party_Abbreviation": "SDLP",
    "Hex_Col": "#cc3300",
    "DClub_Id": "party:55"
}, {
    "Party_Id": "141",
    "Party_Name": "Traditional Unionist Voice",
    "Party_Abbreviation": "TUV",
    "Hex_Col": "#0000e6",
    "DClub_Id": "party:680"
}, {
    "Party_Id": "689",
    "Party_Name": "UK Independence Party",
    "Party_Abbreviation": "UKIP",
    "Hex_Col": "#cc00cc",
    "DClub_Id": ""
}, {
    "Party_Id": "26",
    "Party_Name": "Ulster Unionist Party",
    "Party_Abbreviation": "UUP",
    "Hex_Col": "#62cae7",
    "DClub_Id": "party:83"
}, {
    "Party_Id": "999",
    "Party_Name": "People Before Profit Alliance",
    "Party_Abbreviation": "PBP",
    "Hex_Col": "#ff3399",
    "DClub_Id": "party:773"
}, {
    "Party_Id": "998",
    "Party_Name": "Workers Party",
    "Party_Abbreviation": "WP",
    "Hex_Col": "#ff0000",
    "DClub_Id": "party:127"
}, {
    "Party_Id": "994",
    "Party_Name": "Progressive Unionist Party",
    "Party_Abbreviation": "PUP",
    "Hex_Col": "#1e0082",
    "DClub_Id": "party:101"
}, {
    "Party_Id": "993",
    "Party_Name": "Cannabis Is Safer Than Alcohol",
    "Party_Abbreviation": "CISTA",
    "Hex_Col": "#ff7979",
    "DClub_Id": "party:2724"
}, {
    "Party_Id": "992",
    "Party_Name": "Labour Alternative",
    "Party_Abbreviation": "LABALT",
    "Hex_Col": "#ca0000",
    "DClub_Id": ""
}, {
    "Party_Id": "991",
    "Party_Name": "NI Conservatives",
    "Party_Abbreviation": "CON",
    "Hex_Col": "#362da7",
    "DClub_Id": "party:51"
}, {
    "Party_Id": "990",
    "Party_Name": "South Belfast Unionists",
    "Party_Abbreviation": "SBU",
    "Hex_Col": "#9195FF",
    "DClub_Id": ""
}, {
    "Party_Id": "989",
    "Party_Name": "NI Labour Representation Committee",
    "Party_Abbreviation": "LRC",
    "Hex_Col": "#800000",
    "DClub_Id": ""
}, {
    "Party_Id": "988",
    "Party_Name": "Northern Ireland First",
    "Party_Abbreviation": "NIF",
    "Hex_Col": "#B3D71D",
    "DClub_Id": ""
}, {
    "Party_Id": "987",
    "Party_Name": "Cross-Community Labour Alternative",
    "Party_Abbreviation": "CCLAB",
    "Hex_Col": "#CE1D4D ",
    "DClub_Id": "party:4037"
}, {
    "Party_Id": "986",
    "Party_Name": "Democracy First",
    "Party_Abbreviation": "DF",
    "Hex_Col": "#D7761D",
    "DClub_Id": ""
}, {
    "Party_Id": "985",
    "Party_Name": "Animal Welfare Party",
    "Party_Abbreviation": "AWP",
    "Hex_Col": "#CE1D99",
    "DClub_Id": ""
}, {
    "Party_Id": ""
}]
var candidatesCSV = '/NI/full-candidates-list.csv';

var demoClubAPI = {
    'person': 'https://candidates.democracyclub.org.uk/api/v0.9/persons/' // follow with id and '.json'
};

function calculatedPartySizes() {
    var arr = [];
    Papa.parse('/data/2017/NI/post-election-candidate-info.csv', {
        header: true,
        download: true,
        complete: function(results) {
            var result = _.countBy(_.map(_.filter(results.data, {
                'Status': 'Elected'
            }), 'Party_Id'));
            _.forEach(result, function(key, value) {
                arr.push({
                    'name': value,
                    'y': key
                });
            });
        }
    })
    return arr
}

const partySizes = calculatedPartySizes();

var elections = {
    '2017': {
        year: '2017',
        dem_club_code: 'nia.2017-03-02',
        date: 'Thu Mar 02 2017 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: true,
        confirmedResults: false,
        seats_each: 5,
        seats_total: 90
    },
    '2016': {
        year: '2016',
        dem_club_code: 'nia.2016-05-05',
        date: 'Thu May 05 2016 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: true,
        confirmedResults: true,
        seats_each: 6,
        seats_total: 108
    },
    '2011': {
        year: '2011',
        dem_club_code: 'nia.2017-03-02',
        date: 'Thu May 05 2011 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: true,
        confirmedResults: true,
        seats_each: 6,
        seats_total: 108
    }
};

var electedArray = [8116, 13037]
var excludedArray = [19680]

const dateFormat = function(dateStr) {
    var date = moment(dateStr).format('D MMMM YYYY')
    return date
}

const Home = {
    template: '#home-page-template', // simple template with no components
    props: ['parties']
}

const ElectionView = Vue.extend({
    props: ['parties'],
    template: '#election-page',
    data: function() {
        var self = this;
        var year;
        if (self.$route.params.year) {
            year = self.$route.params.year
        } else {
            year = '2017'
        }
        var candidatesFile = '/data/' + year + candidatesCSV
        Papa.parse(candidatesFile, {
            download: true,
            header: true,
            complete: function(results) {
                self.candidates = _.sortBy(results.data, ["Constituency_Number", "Surname"]);
            }
        });
        return {
            candidates: [], //empty array, filled asyncronously
            election: elections[year],
        }
    }
})

const CandidatesView = Vue.extend({
    props: ['election'],
    template: '#all-candidates-page',
    data: function() {
        var self = this;
        var year, candidates;
        if (self.$parent.election.year) {
            year = self.$parent.election.year
        } else {
            year = '2017'
        }
        var file = '/data/' + year + candidatesCSV
        Papa.parse(file, {
            download: true,
            header: true,
            complete: function(results) {
                self.candidates = _.sortBy(results.data, ["Constituency_Number", "Surname"]);
            }
        });
        return {
            candidates: candidates,
            confirmedCandidates: this.$parent.election.confirmedCandidates
        }
    }
})

Vue.component('candidate-list', {
    props: ['election'],
    template: '#candidate-list',
    data: function() {
        return {
            excluded: excludedArray,
            elected: electedArray
        }
    },
    computed: {
        candidates: function() {
            return this.$parent.candidates
        },
        parties: function() { // list of unique parties from all of the candidates in the list
            if (this.$parent.candidates !== null) {
                return _.orderBy(_.uniqBy(_.map(this.$parent.candidates, _.partialRight(_.pick, ['Party_Id', 'Party_Name'])), 'Party_Id'), 'Party_Name')
            }
        },
        constituencies: function() {
            if (this.$parent.candidates !== null) {
                return _.orderBy(_.uniqBy(_.map(this.$parent.candidates, _.partialRight(_.pick, ['Constituency_Number', 'Constituency_Name'])), 'Constituency_Number'), 'Constituency_Name')
            }
        }
    }
})

const CandidateView = Vue.extend({
    props: ['election'],
    template: '#candidate-page',
    data: function() {
        var self = this;
        var candidate, demoClub;
        for (var i = 0; i < self.$parent.candidates.length; i++) {
            if (self.$parent.candidates[i].Candidate_Id == this.$route.params.id) {
                candidate = self.$parent.candidates[i];
                break;
            }
        } {
            this.$http.get(demoClubAPI.person + this.$route.params.id + '.json').then(response => {
                self.demoClub = response.body;
                console.log(response.body)
            }, response => {
                console.log("error retrieving data from DemoClubAPI")
            });
        }
        return {
            candidate: candidate,
            demoClub: demoClub
        }
    }
});

Vue.component('seat-gauge', {
    template: '#seat-gauge',
    data: function() {
        return {
            excluded: excludedArray,
            elected: null,
            options: seatGauge
        }
    },
    mounted: function() {
        this.updateChart()
    },
    methods: {
        updateChart: function() {
            var self = this;
            Papa.parse('/data/2017/NI/post-election-candidate-info.csv', {
                header: true,
                download: true,
                complete: function(results) {
                    var arr = [];
                    var result = _.countBy(_.map(_.filter(results.data, {
                        'Status': 'Elected'
                    }), 'Party_Id'));
                    _.forEach(result, function(key, value) {
                        arr.push({
                            'name': value,
                            'y': key
                        });
                    });
                    self.$refs.highcharts.chart.series[0].setData(['Party', arr.length])
                }
            })
        }
    }
})

Vue.component('parties-gauge', {
    // props: ['parties'],
    template: '#parties-gauge',
    data: function() {
        return {
            options: partiesGauge,
            elected_candidates: null,
            party_sizes: null,
            parties: null
        }
    },
    mounted: function() {
        this.createChart();
    },
    methods: {
        createChart: function() {
            var self = this;
            var url = '/data/2017/NI/parties.csv';
            Papa.parse(url, {
                header: true,
                download: true,
                complete: function(results) {
                    self.parties = results.data;
                    Papa.parse('/data/2017/NI/post-election-candidate-info.csv', {
                        header: true,
                        download: true,
                        complete: function(results) {
                            var arr = [];
                            var parties = self.parties;
                            var elected = _.filter(results.data, {
                                'Status': 'Elected'
                            });
                            self.elected_candidates = elected
                            var data = _.countBy(_.map(elected), 'Party_Id');
                            _.forEach(data, function(value, key) {
                                arr.push({
                                    name: _.map(_.filter(parties, {
                                        "Party_Id": key
                                    }), 'Party_Abbreviation')[0],
                                    'y': value,
                                    color: _.map(_.filter(parties, {
                                        "Party_Id": key
                                    }), 'Hex_Col')[0]
                                });
                            });
                            arr = _.orderBy(arr, 'y', 'desc')
                            arr.push({ // this represents unfilled seats
                                'name': 'not yet declared',
                                'y': 108 - elected.length,
                                'color': 'rgba(255,255,255,0)',
                                'dataLabels': false
                            })
                            self.party_sizes = arr
                            self.$refs.highcharts.chart.series[0].setData(arr)
                            self.$refs.highcharts.chart.setTitle(null, {
                                text: elected.length + ' of 90 seats filled'
                            })
                        }
                    })
                }
            })
        }
    }
})

const router = new VueRouter({
    mode: 'history',
    base: '/',
    abstract: true,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            }
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    },
    routes: [{
        path: '/',
        component: Home
    }, {
        name: 'election',
        path: '/:year',
        component: ElectionView
    }, {
        name: 'candidates',
        path: '/:year/candidates',
        component: CandidatesView
    }, {
        name: 'candidate',
        path: '/:year/candidates/:id',
        component: CandidateView
    }]
});

var app = new Vue({
    router,
    data: {
        // election: null,
        parties: null
    },
    created: function() {
        // this.fetchYear();
        // this.fetchParties();
    },
    computed: {
        election: function() {
          var self = this;
          var year;
          if (self.$route.params.year) {
              year = self.$route.params.year
          } else {
              year = '2017'
          }
          var url = '/data/' + year + '/NI/parties.csv';
          Papa.parse(url, {
              header: true,
              download: true,
              complete: function(results) {
                  self.parties = results.data
              }
          })
          return elections[year]
        }
    },
    methods: {
        // fetchYear: function() {
        //     var self = this;
        //     var year;
        //     if (self.$route.params.year) {
        //         year = self.$route.params.year
        //     } else {
        //         year = '2017'
        //     }
        //     self.election = elections[year]
        // },
        // fetchParties: function() {
        //     var self = this;
        //     var url = '/data/2017/NI/parties.csv';
        //     Papa.parse(url, {
        //         header: true,
        //         download: true,
        //         complete: function(results) {
        //             self.parties = results.data
        //         }
        //     })
        // }
    }
}).$mount('#app')
