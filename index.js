var candidatesCSV = '/NI/full-candidates-list.csv';

var demoClubAPI = {
    'person': {
        'url': 'https://candidates.democracyclub.org.uk/api/v0.9/persons/' // follow with id and '.json'
    }
};


var elections = {
    '2017': {
        dem_club_code: 'nia.2017-03-02',
        date: 'Thu Mar 02 2017 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: false,
        confirmedResults: false
    },
    '2016': {
        dem_club_code: 'nia.2016-05-05',
        date: 'Thu May 05 2016 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: true,
        confirmedResults: true
    },
    '2011': {
        dem_club_code: 'nia.2017-03-02',
        date: 'Thu May 05 2011 00:00:00 GMT+0000 (GMT Standard Time)',
        confirmedCandidates: true,
        confirmedResults: true
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
        return {
            candidates: this.$parent.candidates,
            confirmedCandidates: this.$parent.elections.confirmedCandidates
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
        var candidate;
        for (var i = 0; i < self.$parent.candidates.length; i++) {
            if (self.$parent.candidates[i].Candidate_id == this.$route.params.id) {
                candidate = self.$parent.candidates[i];
                break;
            }
        }
        return {
            candidate: candidate
        }
    }
});

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
        elections: null,
        candidates: null
    },
    created: function() {
        this.fetchCandidateData();
        this.fetchYear();
    },
    methods: {
        fetchCandidateData: function() {
            var self = this;
            var year = '2017';
            if (self.$route.params.year) {
                year = self.$route.params.year
            } else {
                year = '2017'
            }
            console.log('YEAR:', year)
            var file = '/data/' + year + candidatesCSV
            Papa.parse(file, {
                download: true,
                header: true,
                complete: function(results) {
                    self.candidates = _.sortBy(results.data, ["Constituency_Number", "Surname"]);
                }
            });
        },
        fetchYear: function() {
          var self = this;
          var year;
          if (self.$route.params.year) {
              year = self.$route.params.year
          } else {
              year = '2017'
          }
          self.elections = elections[year]
        }
    }
}).$mount('#app')
