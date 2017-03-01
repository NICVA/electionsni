//function generateData() {

var constituencies = ["Belfast East", "Belfast North", "Belfast South", "Belfast West",
    "East Antrim", "East Londonderry", "Fermanagh and South Tyrone", "Foyle", "Lagan Valley",
    "Mid Ulster", "Newry and Armagh", "North Antrim", "North Down", "South Antrim", "South Down",
    "Strangford", "Upper Bann", "West Tyrone"
];

var parties = {
    "Alliance Party": {
        "Party_Id": 19,
        "Party_Abbreviation": "APNI",
        "Hex_Col": "#ffe600"
    },
    "Democratic Unionist Party": {
        "Party_Id": 20,
        "Party_Abbreviation": "DUP",
        "Hex_Col": "#ff8000"
    },
    "Green Party": {
        "Party_Id": 111,
        "Party_Abbreviation": "GPNI",
        "Hex_Col": "#33ff33"
    },
    "Independent": {
        "Party_Id": 21,
        "Party_Abbreviation": "IND",
        "Hex_Col": "#669999"
    },
    "Sinn Fein": {
        "Party_Id": 24,
        "Party_Abbreviation": "SF",
        "Hex_Col": "#009900"
    },
    "Social Democratic and Labour Party": {
        "Party_Id": 23,
        "Party_Abbreviation": "SDLP",
        "Hex_Col": "#cc3300"
    },
    "Traditional Unionist Voice": {
        "Party_Id": 141,
        "Party_Abbreviation": "TUV",
        "Hex_Col": "#0000e6"
    },
    "UK Independence Party": {
        "Party_Id": 689,
        "Party_Abbreviation": "UKIP",
        "Hex_Col": "#cc00cc"
    },
    "Ulster Unionist Party": {
        "Party_Id": 26,
        "Party_Abbreviation": "UUP",
        "Hex_Col": "#62cae7"
    },
    "People Before Profit Alliance": {
        "Party_Id": 999,
        "Party_Abbreviation": "PBP",
        "Hex_Col": "#ff3399"
    },
    "Workers Party": {
        "Party_Id": 998,
        "Party_Abbreviation": "WP",
        "Hex_Col": "#ff0000"
    },
    "Progressive Unionist Party": {
        "Party_Id": 994,
        "Party_Abbreviation": "PUP",
        "Hex_Col": "#1e0082"
    },
    "Citizens Independent Social Thought Alliance": {
        "Party_Id": 993,
        "Party_Abbreviation": "CISTA",
        "Hex_Col": "#ff7979"
    },
    "Cross-Community Labour Alternative": {
        "Party_Id": 987,
        "Party_Abbreviation": "CCLAB",
        "Hex_Col": "#ce1d4d"
    },
    "NI Conservatives": {
        "Party_Id": 991,
        "Party_Abbreviation": "CON",
        "Hex_Col": "#362da7"
    }
}

var data = [];

// create party divs
$.each(parties, function(i, party) {
    var pname = party.Party_Abbreviation;
    $("#party_matrix").append("<div id='" + pname + "' class='party'/>");
    $("#" + pname).append("<div class='name'>" + i + "</div>");
    $("#" + pname).append("<div class='results' />");
});

// iterate thru constituencies
$.each(constituencies, function(i, constituency) {
    var cname = constituency.replace(" and ", "-").replace(" ", "-").toLowerCase();
    // create the constituency div
    $("#overview_matrix").append("<div id='" + cname + "' class='constituency'/>");
    $("#" + cname).append("<div class='name'>" + constituency + "</div>");
    $("#" + cname).append("<div class='results' />");
});

// request the constituency results data
$.ajax({
        'async': false,
        'global': false,
        'url': "/2016/NI/all-elected.json",
        'dataType': "json",
        'success': function(data) {
            $.each(data.Constituencies, function(i, constituency) {
                var cname = constituency.Constituency_Name.replace(" and ", "-").replace(" ", "-").toLowerCase();
                // get the elected reps from the data
                var electedReps = sortElected(constituency.Elected);
                // for each elected rep, add a result element to the constituency and party divs
                $.each(electedReps, function(i, rep) {
                    var id = rep.Candidate_Id;
                    var result = "<div class='result " + id + "' />";
                    $("#" + cname + " .results").append(result); // add result to constituency div
                    var party = parties[rep.Party_Name].Party_Abbreviation;
                    $("#" + party + " .results").append(result); // add result to party div
                    // increment num_elected for this party
                    parties[rep.Party_Name].Num_Elected = parties[rep.Party_Name].Num_Elected + 1 || 1;
                    var thisResult = $("." + id);
                    var name = rep.Firstname + " " + rep.Surname;
                    var votes = rep.Candidate_First_Pref_Votes;
                    var colour = parties[rep.Party_Name].Hex_Col;
                    thisResult.css("background", colour);
                    thisResult.hover(
                        function() {
                            $(this).css("opacity", 0.5);
                            $("#matrixtooltip").show();
                            $("#matrixtooltip").html(
                                name + " (" + party + ")<br>" +
                                votes + " first pref votes"
                            );
                        },
                        function() {
                            $(this).css("opacity", 1);
                            $("#matrixtooltip").hide();
                        });
                });
            });
        }
    })
    .fail(function(e) {
        console.log(e)
    });



// sort parties according to greatest num_elected
function compareElected(a, b) {
    if (a.Num_Elected < b.Num_Elected)
        return 1;
    else if (a.Num_Elected > b.Num_Elected)
        return -1;
    else
        return 0;
}
var partyArray = $.map(parties, function(party) {
    party.Num_Elected = party.Num_Elected || 0;
    return party
});

partyArray = partyArray.sort(compareElected);

// position each party according to num_elected
$.each(partyArray, function(i, party) {
    $("#" + party.Party_Abbreviation).css("top", i * 20 + 44);
})

function sortElected(elected) {
    function compareCount(a, b) {
        if (a.Candidate_First_Pref_Votes > b.Candidate_First_Pref_Votes)
            return -1;
        else if (a.Candidate_First_Pref_Votes < b.Candidate_First_Pref_Votes)
            return 1;
        else
            return 0;
    }
    return elected.sort(compareCount);
}
