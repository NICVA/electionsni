Vue.use(VueHighcharts)

var candidatesCSV = '/NI/full-candidates-list.csv';

var demoClubAPI = {
    'person': 'https://candidates.democracyclub.org.uk/api/v0.9/persons/' // follow with id and '.json'
};


var elections = {
    '2017': {
        year: '2017',
        dem_club_code: 'nia.2017-03-02',
        date: 'Thu Mar 02 2017 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: false,
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
        seats_total: 90
    },
    '2011': {
        year: '2011',
        dem_club_code: 'nia.2017-03-02',
        date: 'Thu May 05 2011 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: true,
        confirmedResults: true,
        seats_each: 6,
        seats_total: 90
    }
};

var electedArray = [8116, 13037]
var excludedArray = [19680]

const dateFormat = function(dateStr) {
    var date = moment(dateStr).format('D MMMM YYYY')
    return date
}

const Home = {
    template: '#home-page-template' // simple template with no components
}

const CandidatesView = Vue.extend({
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
            elected: electedArray,
            options: seatGauge
        }
    },
    mounted: function() {
        this.updateSeats();
    },
    methods: {
        updateSeats: function() {
            this.$refs.highcharts.chart.series[0].setData(['90', this.elected.length])
        }
    }
})

Vue.component('parties-gauge', {
    template: '#parties-gauge',
    data: function() {
        return {
            excluded: excludedArray,
            elected: electedArray,
            options: partiesGauge
        }
    },
    mounted: function() {
        this.updateSeats();
    },
    methods: {
        updateSeats: function() {
            // this.$refs.highcharts.chart
        }
    }
})

const router = new VueRouter({
    mode: 'hash',
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
        name: 'candidates',
        path: '/candidates/:year',
        component: CandidatesView
    }, {
        name: 'candidate',
        path: '/candidates/:year/:id',
        component: CandidateView
    }]
});

var app = new Vue({
    router,
    data: {
        // election: null,
        // candidates: null
    },
    created: function() {
        // this.fetchCandidates();
        this.fetchYear();
    },
    computed: {
        // election: function() {
        //     var self = this;
        //     var year;
        //     if (self.$route.params.year) {
        //         year = self.$route.params.year
        //     } else {
        //         year = '2017'
        //     }
        //     return elections[year]
        // },
        // candidates: function() {
        //     var self = this;
        //     var year;
        //     var candidates = self.candidates;
        //     if (self.election.year) {
        //         year = self.election.year
        //     } else {
        //         year = '2017'
        //     }
        //     var file = '/data/' + year + candidatesCSV
        //     console.log(file)
        //     Papa.parse(file, {
        //         download: true,
        //         header: true,
        //         complete: function(results) {
        //           console.log('candidates', candidates)
        //             candidates = _.sortBy(results.data, ["Constituency_Number", "Surname"]);
        //             return candidates
        //             console.log(candidates)
        //         }
        //     });
        // }
    },
    methods: {
        fetchYear: function() {
            var self = this;
            var year;
            if (self.$route.params.year) {
                year = self.$route.params.year
            } else {
                year = '2017'
            }
            self.election = elections[year]
        },
        // fetchCandidates: function() {
        //     var self = this;
        //     var year;
        //     if (self.election.year) {
        //         year = self.election.year
        //     } else {
        //         year = '2017'
        //     }
        //     console.log('YEAR:', year)
        //     var file = '/data/' + year + candidatesCSV
        //     Papa.parse(file, {
        //         download: true,
        //         header: true,
        //         complete: function(results) {
        //             console.log(results)
        //             self.candidates = _.sortBy(results.data, ["Constituency_Number", "Surname"]);
        //         }
        //     });
        // }
    }
}).$mount('#app')
