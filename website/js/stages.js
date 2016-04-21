/* This work is licensed under a Creative Commons Attribution 4.0 International License - http://creativecommons.org/licenses/by/4.0 
 * Created by James Bligh (@anamates) for clairebyrne.ie and all thanks to data.localgov.ie
 */

//some control variables
var speed = 1;
var leftPadding = 10;
var nameSpace = 200;
var startLeft = leftPadding+nameSpace;
var voteWidth = 600;
var running = true;
var earlyStage = true;

var json = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "ResultsJson.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
console.log(json);
var	constituency = json.Constituency.countInfo;
var data = json.Constituency.countGroup;

if(constituency){
    //set the top right bit
    var constituencyCode = constituency["Constituency_Name"];
	var quota = parseInt(constituency["Quota"]);
    var seats = parseInt(constituency["Number_Of_Seats"]);
	$("#constituency-span").text(constituencyCode);
    $("#quota-span").text(quota);
    $("#seats-span").text(seats);
    $("#theline").css({top:3+(seats+1)*30});
    var qFactor = voteWidth/quota; //all actual vote counts are multiplied by this to get a div width in proportion

    /** 
     * The data gets parsed into two dictionaries containing snippets of the following form
     * candidate data object of the form {
     *  id:String,     candidate's id in data 
     *  name:String,   candidate's name 
     *  status:String, is the candidate elected or excluded
     *  party:String   party string suitable to use as html/css class
     * }
     *
     * countData of the form {
     *  total:Number,      the total for a candidate at specfic round of the count
     *  status:String,     the status of the candidate at specfic round
     *  order:Number       a candidates order at a specfic round
     *  transfers:Boolean  does this candidate transfer in this round
     * }
     **/

    var candidatesDict = {}; //Dictionary of candidates {} id as key
    var candidates = [];     //Array of candidates in order first seen in data
    var countDict = {};      //Dictionary of counts, first level key is count number, which points to a dict of countData with key candidate id
    var transferDict={};     //Corresponding dictionary of transfers indexed by [count number][candidate id]
    var counts = 1;

    //loop through all the data and populate the various dictionaries
    for (var i=0; i<data.length; i++) {
        if (!(data[i]["Count_Number"] in countDict)) {
            countDict[data[i]["Count_Number"]] = {};
        }
        if (!(data[i]["Count_Number"] in transferDict)) {
            transferDict[data[i]["Count_Number"]] = {};
        }
        countDict[data[i]["Count_Number"]][data[i]["Candidate_Id"]] = {
            total:parseInt(data[i]["Total_Votes"]),
            status:(typeof(data[i]["Status"])=="string")?data[i]["Status"]:"",
            order:0,
            transfers:((data[i]["Status"] == "Excluded" && parseInt(data[i]["Transfers"]) < 0) ||
                       (data[i]["Status"] == "Elected" && parseInt(data[i]["Transfers"]) < 0))
        }
        transferDict[data[i]["Count_Number"]][data[i]["Candidate_Id"]] = Math.max(0, parseInt(data[i]["Transfers"], 10));
		
		console.log(countDict);

        if (!(data[i]["Candidate_Id"] in candidatesDict)) {
            var party = data[i]["Party_Name"];
            if (typeof(party)!="string"){ party = "Non-Party";}
            party=party.replace(/\s+/g,"-");
            candidates.push({
                name:data[i]["Firstname"]+" "+((typeof(data[i]["Surname"])=="string")?data[i]["Surname"]:""),
                id:data[i]["Candidate_Id"],
                status:data[i]["Status"],
                party:party
            });
            candidatesDict[data[i]["Candidate_Id"]] = {
                name:data[i]["Firstname"]+" "+((typeof(data[i]["Surname"])=="string")?data[i]["Surname"]:""),
                id:data[i]["Candidate_Id"],
                status:"",
                party:party
            };
        }
        counts = Math.max(counts, parseInt(data[i]["Count_Number"], 10));
    }
    
    //once we have all the data in the countDict we can now go through each count and order it
    //we do this in order as once a candidate is elected we store their final order in the candidatesDict and reuse it subsquent counts
    //only sorting candidates that are not eliminated or elected

    for (var k=1; k<=counts;k++){
        if (countDict.hasOwnProperty(k)) {
            adjustOrder(countDict[k]);
        }
    }

    //now we have the data set up we just hook up our links to functions

    $("#pause-replay").click(function(event) {
        event.preventDefault();
        if ($(this).text() == "Pause") {
            $(this).text("Resume");
            pause();
        } else if ($(this).text() == "Resume") {
            $(this).text("Pause");
            resume();
        } else {
            $(this).text("Pause");
            replay(1);
        }
    });

    $("#step").click(function(event) {
        event.preventDefault();
        step();
    });

    $("#again").click(function(event) {
        event.preventDefault();
        again();
    });

    firstCount();  //run the first count
    var countNumber = 2;  //global loop variable
    //set the advance count function to run in a loop
    var loop = window.setInterval(advanceCount,4000*speed);
}else{
    //if we didn't load a constituency var then we have no data yet
    $("body").text("There is no data up for this constituency at present");
}

//the magic, simple enough, append some divs and animate their width's to final position 
//then animate their top to final position and move the name div at the same time
function firstCount(){
    $("#thepost").height(candidates.length*30);
    for(var j=0;j<candidates.length;j++){
        $('<div id="cname'+candidates[j].id+'" class="candidateLabel '+candidates[j]["party"]+'_label" style="top:'+(40 + (j*30)) +'px;left:10px;">'+candidates[j]["name"]+'</div>')
        .appendTo("body");
        $('<div data-candidate="'+candidates[j].id+'" id="candidate'+candidates[j].id+'" class="votes '+candidates[j]["party"]+'" style="top:'+(40 + (j*30)) +'px;left:'+startLeft+'px;"></div>')
        .appendTo("body")
        .animate({width:countDict[1][candidates[j].id]["total"] * qFactor},1500*speed).text(countDict[1][candidates[j].id]["total"]+ " " + countDict[1][candidates[j].id]["status"])
        .animate({top:40+(countDict[1][candidates[j].id]["order"]*30)},{
            duration:500*speed,
            start:function(){
                $("#cname"+$(this).data('candidate'))
                .animate({top:40+(countDict[1][$(this).data('candidate')]["order"]*30)},500*speed)
            }
        });
    }
}

//find the first candidate who is transferring, all transfers from the round start from here
//append some divs with width relative to transfer number, animate them to their candidates current order 
//then animate them accross to end of candidates vote pile, when complete remove the new div and update the candidates div width
//finally run the reorder animation
function advanceCount(){
    var transfered=false;
    if(countNumber in countDict){
        earlyStage = true;
        var i = countNumber;
        $("#count-span").text(countNumber);
        for (var j=0;j<candidates.length;j++) {
            if (countDict[i][candidates[j].id]["transfers"]) {
                //we have to break it down now instead
                $("#candidate"+candidates[j].id).width(countDict[i][candidates[j].id]["total"] * qFactor);
                var transfers = transferDict[i];
                var left = startLeft + countDict[i][candidates[j].id]["total"] * qFactor;
                var top = 40 + (countDict[i-1][candidates[j].id]["order"]*30);
                if (!transfered){
                    for (var t=0;t<candidates.length;t++) {
                        if (countDict[i][candidates[t].id]["transfers"] == false) {
                            var localLeft = startLeft+countDict[i-1][candidates[t].id]["total"] * qFactor;
                            $('<div data-candidate="'+candidates[t].id+'" style="width:'+transfers[candidates[t].id] * qFactor+'px;left:'+left+'px; top:'+top+'px;" class="votes '+candidates[t]["party"]+'"></div>')
                                .appendTo("body").delay(300*speed)
                                .animate({top:40 + (countDict[i-1][candidates[t].id]["order"]*30), left:startLeft+voteWidth+20},900*speed, function(){
                                    earlyStage = false;
                                    if (transfers[$(this).data('candidate')] >0 ){
                                        $("#candidate"+$(this).data('candidate'))
                                        .text(countDict[i-1][$(this).data('candidate')]["total"]+" + "+transfers[$(this).data('candidate')]+ " " + countDict[i][$(this).data('candidate')]["status"]);
                                    }
                                }).delay(100*speed)
                                .animate({left:localLeft},900*speed, function(){
                                    $("#candidate"+$(this).data('candidate')).width(countDict[i][$(this).data('candidate')]["total"] * qFactor)
                                    .text(countDict[i][$(this).data('candidate')]["total"] + " " + countDict[i][$(this).data('candidate')]["status"])
                                    .animate({top:40+(countDict[i][$(this).data('candidate')]["order"]*30)},{
                                        duration:500*speed,
                                        start:function(){
                                            $("#cname"+$(this).data('candidate'))
                                            .animate({top:40+(countDict[i][$(this).data('candidate')]["order"]*30)},500*speed)
                                        }
                                    });
                                    //TODO:at this point we'd like to animate to new order
                                    $(this).remove();
                                });
                            left = left + transfers[candidates[t].id] * qFactor;
                        }
                    }
                    //could put dead votes in here                    
                    transfered = true;
                }
                $("#candidate"+candidates[j].id).width(countDict[i][candidates[j].id]["total"] * qFactor).text(countDict[i][candidates[j].id]["total"] + " " + countDict[i][candidates[j].id]["status"]);
            }
        }
    }else{
        clearInterval(loop);
        $("#pause-replay").text("Replay");
    }
    countNumber += 1;

}

function pause(){
    clearInterval(loop);
    running = false;
}

function resume(){
    advanceCount();
    loop = window.setInterval(advanceCount,4000*speed);
    running = true;
}

function replay(s){
    if (running) {
        clearInterval(loop);
    }
    $("#count-span").text("1");
    $(".candidateLabel").remove();
    $(".votes").remove();
    speed = s;
    firstCount();
    countNumber = 2;
    loop = window.setInterval(advanceCount,4000*speed);
    running = true;
}

function step(){
    if (running) {
        clearInterval(loop);
    }
    playStep(countNumber);
    if (running) {
        loop = window.setInterval(advanceCount,4000*speed);
    }
}

function again() {
    if (running) {
        clearInterval(loop);
    }

    if (earlyStage && countNumber>2) {
        countNumber-=2;
    }else if (countNumber>1) {
        countNumber--;
    }
    playStep(countNumber);
    if (running) {
        loop = window.setInterval(advanceCount,4000*speed);
    }
}

function advanceStep(){
    advanceCount();
}

function playStep(i){
    countNumber = i;
    if (countNumber in countDict) {
        $('div').stop(true, true);
        $(".candidateLabel").remove();
        $(".votes").remove();
        if (i>1){
            for(var j=0;j<candidates.length;j++){
                $('<div id="cname'+candidates[j].id+'" class="candidateLabel '+candidates[j]["party"]+'_label" style="top:'+(40 + (countDict[i-1][candidates[j].id]["order"]*30)) +'px;left:10px;">'+candidates[j]["name"]+'</div>')
                .appendTo("body");
                $('<div data-candidate="'+candidates[j].id+'" id="candidate'+candidates[j].id+'" class="votes '+candidates[j]["party"]+'" style="top:'+(40 + (countDict[i-1][candidates[j].id]["order"]*30)) +'px;left:'+startLeft+'px;"></div>')
                .appendTo("body");
                $("#candidate"+candidates[j].id).width(countDict[i-1][candidates[j].id]["total"] * qFactor).text(countDict[i-1][candidates[j].id]["total"]);
            }
            advanceCount();
        } else {
            firstCount();
            countNumber = 2;
        }
    }
}

function adjustOrder(singleCountDict){
    var copy=[];
    var start=0;
    var end=0;

    for (var k in singleCountDict){
        if (singleCountDict.hasOwnProperty(k)) {
            var data = singleCountDict[k];
            if (data["status"] == "Elected" && candidatesDict[k]["status"]) {
                start++;
                data["order"] = candidatesDict[k]["order"];
            }else if (singleCountDict[k]["status"] == "Excluded" && candidatesDict[k]["status"]) {
                end++;
                data["order"] = candidatesDict[k]["order"];
            }else{
                copy.push({
                    key: k, 
                    count: data["total"]
                });
            }
        }
    }

    copy.sort(function (a, b) {
        if (a.count > b.count)
          return -1;
        if (a.count < b.count)
          return 1;
        // a must be equal to b
        return 0;
    });

    //candidatesDict is global and we use it here to store state of where those people we're not ordering are elected
    for(var i=0;i<copy.length;i++){
        singleCountDict[copy[i]["key"]].order = i+start;
        candidatesDict[copy[i]["key"]].order = i+start;
        if (singleCountDict[copy[i]["key"]]["status"] != "" ) {
            candidatesDict[copy[i]["key"]].status = singleCountDict[copy[i]["key"]]["status"];
        }
    }
}