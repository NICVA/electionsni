//function generateData() {

var constituencies = ["Belfast East", "Belfast North", "Belfast South", "Belfast West", "East Antrim", "East Londonderry", "Fermanagh and South Tyrone", "Foyle", "Lagan Valley", "Mid Ulster", "Newry and Armagh", "North Antrim", "North Down", "South Antrim", "South Down", "Strangford", "Upper Bann", "West Tyrone"];


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
  "NI21": {
    "Party_Id": 918,
    "Party_Abbreviation": "NI21",
    "Hex_Col": "#581845"
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
  "Procapitalism": {
    "Party_Id": 997,
    "Party_Abbreviation": "CAP",
    "Hex_Col": "#f633ff"
  },
  "Socialist Party": {
    "Party_Id": 996,
    "Party_Abbreviation": "SP",
    "Hex_Col": "#e60000"
  },
  "Socialist Party (NI)": {
    "Party_Id": 996,
    "Party_Abbreviation": "SP",
    "Hex_Col": "#e60000"
  },
  "British Nationalist Party": {
    "Party_Id": 995,
    "Party_Abbreviation": "BNP",
    "Hex_Col": "#b7bdff"
  },
  "Progressive Unionist Party": {
    "Party_Id": 994,
    "Party_Abbreviation": "PUP",
    "Hex_Col": "#1e0082"
  },
  "Animal Welfare Party": {
    "Party_Id": 985,
    "Party_Abbreviation": "AWP",
    "Hex_Col": "#ce1d99"
  },
  "Cannabis Is Safer Than Alcohol": {
    "Party_Id": 993,
    "Party_Abbreviation": "CISTA",
    "Hex_Col": "#ff7979"
  },
  "Cross-Community Labour Alternative": {
    "Party_Id": 987,
    "Party_Abbreviation": "CCLAB",
    "Hex_Col": "#ce1d4d"
  },
  "Democracy First": {
    "Party_Id": 986,
    "Party_Abbreviation": "DF",
    "Hex_Col": "#d7761d"
  },
  "Labour Alternative": {
    "Party_Id": 992,
    "Party_Abbreviation": "LABALT",
    "Hex_Col": "#ca0000"
  },
  "NI Conservatives": {
    "Party_Id": 991,
    "Party_Abbreviation": "CON",
    "Hex_Col": "#362da7"
  },
  "South Belfast Unionists": {
    "Party_Id": 990,
    "Party_Abbreviation": "SBU",
    "Hex_Col": "#9195ff"
  },
  "Northern Ireland First": {
    "Party_Id": 988,
    "Party_Abbreviation": "NIF",
    "Hex_Col": "#b3d71d"
  },
  "NI Labour Representation Committee": {
    "Party_Id": 989,
    "Party_Abbreviation": "LRC",
    "Hex_Col": "#800000"
  },
  "not_transferred": {
    "Party_Id": 0,
    "Party_Abbreviation": "N/T",
    "Hex_Col": "#fff"
  }
}

var transferData = {};
function getTransfersData(year) {
	$.getJSON("/" + year + "/NI/party-transfers.json", function (json) {
		console.log(json);
		var transfers = {};
		$.each(json, function (i, constituency) {
			var con = constituency.Constituency_Name;
			transfers[con] = {};
			$.each(constituency.Counts, function (j, count) { // loop thru each count
				for (var donor in count.From) break; // get the name of the donor party
				// create party if does not exist
				if (!transfers[con][donor]) {
					transfers[con][donor] = {total: count.From[donor]}; //initialise and add total  
				} else {
					transfers[con][donor].total += count.From[donor]; // add to existing total
				}
				if (!transfers[con][donor]["Not Transferred"]) {
					transfers[con][donor].not_transferred = count.Not_transferred; // create not_transferred value
				} else {
					transfers[con][donor].not_transferred += count.Not_transferred; // add to exisiting n_t value
				}
				$.each(count.To, function (recipient, amount) { // loop thru each recipient
					if (!transfers[con][donor][recipient]) { // if recipient does not exist
						transfers[con][donor][recipient] = amount; // set recipient value = amount
					} else {
						transfers[con][donor][recipient] += amount // add to existing recipient amount 
					};
				});
			});
		});
		console.log("transfers", transfers);
		// convert constituency objects to arrays of individual transfers
		$.each(transfers, function (cname, constituency) { // loop thru constituencies
	//        console.log("--- " + cname + " ---");
			var data = [];
			$.each(constituency, function (donor, transfers) { // loop thru donor parties
				var totalTransfers = -transfers.total || 0;
	//            console.log(donor, totalTransfers);
				$.each(transfers, function (recipient, amount) { // loop thru recipient parties
	//                console.log(transfers);
					if (recipient != "total") {
						data.push({
							donor: donor,
							donor_short: parties[donor].Party_Abbreviation,
							recipient: parties[recipient].Party_Abbreviation,
							color: parties[donor].Hex_Col,
							amount: amount / totalTransfers * 100 
						});
					}
				});
			});
			transferData[cname] = data;
		});
		
		console.log("transferData", transferData);
		
		function loadViz() {
			$.get("/website/jsonspec/transferSpec.json", function (json) {
				var spec = JSON5.parse(json);
				var constituency = $("#constituencySelect :selected").text();
				console.log("CONST", constituency);
				var data = transferData[constituency];
				console.log("DATA", data)
				spec.data = [
					{
						name: "transfers",
						values: data
					},
					{
					  name: "ty",
					  source: "transfers",
					  transform: [
						{
							type: "aggregate", 
							groupby: "donor",
							summarize: {donor: "distinct"}
						},
						{
							type: "rank", 
							field: "donor"
						},                    {
							type: "formula", 
							field: "height",
							expr: "datum.rank*30"
						}
					  ]
					},
					{
					  name: "tx",
					  source: "transfers",
					  transform: [
						{
							type: "aggregate", 
							groupby: "recipient",
							summarize: {recipient: "distinct"}
						},
						{
							type: "rank", 
							field: "recipient"
						},                    {
							type: "formula", 
							field: "width",
							expr: "datum.rank*35"
						}
					  ]
					}
				];
				vg.parse.spec(spec, function (chart) {
					var view = chart({
							el: "#transfers"
						})
						.on("mouseover", function (event, item) {
							if (item && item.datum.amount) {
								console.log(item);
								$('#matrixtooltip').show();
								$('#matrixtooltip').html(
									Math.round(item.datum.amount * 10) /10 + "%"
								);
							} else {
								$('#matrixtooltip').hide();
							}
						})
						.update();
				});
			}, "text");
		}
		
		$("#constituencySelect").change(loadViz);
		loadViz();
});
}
