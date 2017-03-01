var checkedYear = 2016;
var output = [];
var constituenciesCount = [];

// though 2016 is the default checked radio element in the html some users who have reloaded may have checked '2011'
// this function examines the two radios to see which has been checked
var inputElements = document.getElementsByName("year");
for (var i = 0; inputElements[i]; ++i) {
    if (inputElements[i].checked) {
        checkedYear = inputElements[i].value;
        break;
    }
}

// create data for summary header
function seatsSummary() {
    $.ajax({
        'async': false,
        'global': false,
        'url': "/2016/NI/all-elected-d3.json",
        'dataType': "json",
        'success': function(data) {
            var result = _.fromPairs(_.sortBy(_.toPairs(_.countBy(_.map(data, 'Party_Name'))), function(a){return a[1]}).reverse());
            console.log(result)
            _.forEach(result, function(value, key) {
                document.getElementById('seats_summary').innerHTML += key + ': ' + value + ' / ';
            })
        }
    });
}

// when a radio button is clicked change checkedYear global var (attached to element onchange)
function changeyear(year) {
    checkedYear = year;
    console.log(checkedYear);
}

// load all candidates info for the checkedYear
findInfo(checkedYear, 'all-candidates.json');

// request candidate info for the specified year (can use this for other request by changing filename arg)
// outputs the parse Json responseText to global var output
function findInfo(year, filename) {
    var request = new XMLHttpRequest();
    var path = '/' + year + '/NI/' + filename;
    console.log(path);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status >= 200 && request.status < 400) {
            output = JSON.parse(request.responseText);
        }
    };
    request.open('GET', path, false);
    request.send();
    request.onerror = function() {
        candidates.innerHTML = 'Connection error retrieving data from the server'
    };
}

// similar to findInfo but used to get constituency count (votes polled etc) and output to global var 'constituenciesCount'
function findConstituencyCountInfo(year, filename) {
    var request = new XMLHttpRequest();
    var path = '/' + year + '/NI/' + filename + '?' + new Date().getTime(); // add ? with timestamp to force XMLHttpRequest not to cache
    console.log(path);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status >= 200 && request.status < 400) {
            constituenciesCount = JSON.parse(request.responseText);
            console.log(constituenciesCount);
        }
    };
    request.open('GET', path, false);
    request.send();
    request.onerror = function() {
        candidates.innerHTML = 'Connection error retrieving data from the server'
    };
}

// again, similar to the above but we're trying to find if any elected candidates exist
function findElectedInfo(year) {
    electedOutput = [];
    var request = new XMLHttpRequest();
    var path = '/' + year + '/NI/all-elected.json?' + new Date().getTime(); // add ? with timestamp to force XMLHttpRequest not to cache
    console.log(path);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status >= 200 && request.status < 400) {
            electedOutput = JSON.parse(request.responseText);
        }
    };
    request.open('GET', path, false);
    request.send();
    request.onerror = function() {
        electedOutput = [];
        console.log('not ready');
    };
}

// examine an object array (obj) for a key (key) matching a value (val) and return the matching object
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == '') {
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1) {
                objects.push(obj);
            }
        }
    }
    return objects;
}

// straightfoward, take a number element e.g. 78521 and add thousand-separator comma to return '78,521' (n.b. this is a string)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

////// FUNCTIONS TO HANDLE HTML ELEMENT POPULATION OF CANDIDATE AND CONSTITUENCY INFORMATION //////
var candidates = document.getElementById('candidates');
var constituencyinfo = document.getElementById('constituencyinfo');

candidates.update = function() {
    this.innerHTML = '';
    var constituency = getObjects(output, 'Constituency_Number', constituency_id);
    var candidates = constituency[0].Candidates;
    console.log(candidates);
    constituencyinfo.innerHTML = '<h2>' + constituency[0].Constituency_Name + ' (' + checkedYear + ')<h2>';
    this.innerHTML += '<p><b>' + candidates.length + ' candidates</b></p>';
    console.log(constituency_directory);
    for (i = 0; i < candidates.length; i++) {
        if (candidates[i].Outgoing_Member == 1) {
            var MLA_text = " MLA"
        } else {
            var MLA_text = ""
        } // disabled - 'MLA' does not appear on ballot
        this.innerHTML += '<div class="votes ' + candidates[i].Party_Name.replace(/\s+/g, "-") + '" style="width: 20px;"></div><div id="candidate ' + candidates[i].Candidate_Id + '" class="tooltip ' + candidates[i].Party_Name.replace(/\s+/g, "-") + '_label">' + candidates[i].Firstname + ' ' + candidates[i].Surname + '<span class="tooltiptext">' + candidates[i].Party_Name + '</span></div><br/>';
    }
    findElectedInfo(checkedYear);
    if (electedOutput.Constituencies) {
        console.log(electedOutput);
        var elected = getObjects(electedOutput, 'Constituency_Number', constituency_id);
        console.log(elected);
        if (elected.length > 0) {
            var elected = elected[0].Elected; // determines if any candidates in the CONSTITUENCY have been ELECTED and returns them, else ignores
        }
        if (elected.length > 0) { // if none have been elected this does not change the div and therefore NOMINATED candidates info remains
            this.innerHTML = '<p><b>' + elected.length + ' candidates ELECTED</b></p>';
            for (i = 0; i < elected.length; i++) {
                this.innerHTML += '<div class="votes ' + elected[i].Party_Name.replace(/\s+/g, "-") + '" style="width: 20px;"></div><div id="candidate ' + elected[i].Candidate_Id + '" class="tooltip ' + elected[i].Party_Name.replace(/\s+/g, "-") + '_label">' + elected[i].Firstname + ' ' + elected[i].Surname + '<span class="tooltiptext">' + elected[i].Party_Name + '</span></div><br/>'
            }
        }
    }
};

// optional message on clearing 'candidates' element. If none set arg to ''
function clearCandidates(msg) {
    candidates.innerHTML = msg;
}

constituencyinfo.update = function() {
    findConstituencyCountInfo(checkedYear, 'all-constituency-info.json');
    var constituency = getObjects(constituenciesCount, 'Constituency_Number', constituency_id);
    console.log(constituency);
    if (constituency[0].countInfo.Voting_Age_Pop) {
        this.innerHTML += '<b>Voting Age Population:</b> ' + numberWithCommas(constituency[0].countInfo.Voting_Age_Pop) + '<br/>';
    }
    if (constituency[0].countInfo.Total_Electorate) {
        this.innerHTML += '<b>Electorate:</b> ' + numberWithCommas(constituency[0].countInfo.Total_Electorate) + '<br/>';
    }
    if (constituency[0].countInfo.Total_Poll) {
        this.innerHTML += '<b>Voted:</b> ' + numberWithCommas(constituency[0].countInfo.Total_Poll) + '<br/><b>Turnout:</b> ' + ((constituency[0].countInfo.Total_Poll / constituency[0].countInfo.Total_Electorate) * 100).toFixed(2) + '%';
    }
};

// function to populate 'candidates' element with all candidates by party
function partiesAll() {
    findInfo(checkedYear, 'all-party-candidates.json');
    for (p = 0; p < output.Parties.length; p++) {
        var id = output.Parties[p].Party_Number;
        var title = output.Parties[p].Party_Name;
        candidates.update('Party_Number', id, title);
    }
};

// function to populate 'candidates' element with all candidates by constituency
function constituenciesAll() {
    findInfo(checkedYear, 'all-candidates.json');
    for (p = 0; p < output.Constituencies.length; p++) {
        var id = output.Constituencies[p].Constituency_Number;
        var title = output.Constituencies[p].Constituency_Name;
        candidates.update('Constituency_Number', id, title);
    }
};

// function to retrive vega spec to populate count matrix //
function countMatrix(year, directory) {
    $.get("/website/jsonspec/countSpec.json", function(json) {
        var spec = JSON5.parse(json);
        spec.data[0].url = '/' + year + '/constituency/' + directory + '/Count.csv'; // needed to dynamically change the data url in spec to our desired path
        console.log(spec);
        vg.parse.spec(spec, function(chart) {
            var view = chart({
                    el: "#count_matrix"
                })
                .on("mouseover", function(event, item) {
                    if (item && item.datum.Surname && item.datum.Status) {
                        console.log(item);
                        $('#matrixtooltip').show();
                        $('#matrixtooltip').html(
                            "<b>" + item.datum.Firstname + ' ' + item.datum.Surname + "</b><br/>" +
                            item.datum.Party_Name + "<br/>" +
                            item.datum.Status + ' on count ' + item.datum.Occurred_On_Count
                        );
                    } else if (item && item.datum.Surname) {
                        console.log(item);
                        $('#matrixtooltip').show();
                        $('#matrixtooltip').html(
                            "<b>" + item.datum.Firstname + ' ' + item.datum.Surname + "</b><br/>" +
                            item.datum.Party_Name
                        );
                    } else {
                        $('#matrixtooltip').hide();
                    }
                })
                .update();
        });
    }, "text");
}

//////<-------------------------------------------------->//////

////// FUNCTIONS TO HANDLE SELECT MENUS (OPTIONS FILLING) //////
function partyoptions() {
    findInfo(checkedYear, 'all-party-candidates.json');
    for (p = 0; p < output.Parties.length; p++) {
        partySelect.innerHTML += '<option value="' + output.Parties[p].Party_Number + '">' + output.Parties[p].Party_Name + '</option>';
    }
}

function constituencyoptions() {
    findInfo(checkedYear, 'all-constituency-info.json');
    console.log(output);
    for (c = 0; c < output.Constituencies.length; c++) {
        constituencySelect.innerHTML += '<option value="' + output.Constituencies[c].Constituency_Number + '" data-dir="' + output.Constituencies[c].Directory + '">' + output.Constituencies[c].Constituency_Name + '</option>';
    }
}

function resetselect(select, defaulttext) {
    select.innerHTML = '<option value=null>' + defaulttext + '</option>';
}
////// <-------------------------------------> //////
