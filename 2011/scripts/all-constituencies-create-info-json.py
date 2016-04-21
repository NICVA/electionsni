import csv
import json
import os

constituencies = ["belfast-east","belfast-north","belfast-south","belfast-west","east-antrim","east-londonderry","fermanagh-south-tyrone","foyle","lagan-valley","mid-ulster","newry-armagh","north-antrim","north-down","south-antrim","south-down","strangford","upper-bann","west-tyrone"]
jsonName = '../NI/all-constituency-info.json'

with open(jsonName, 'wb') as jsonfile:
    jsonfile.write('{"Constituencies": [\n')
    i = 0
    for con in constituencies:
        constituencyfileName = '../constituency/' + con + '/ConstituencyCount.csv'
        constituencyfile = open(constituencyfileName, 'r')

        constituencyfields = csv.reader(constituencyfile).next()
        
        constituencyreader = csv.DictReader(constituencyfile, constituencyfields)

        if i != 0:
            jsonfile.write(',\n')
        i += 1
        
        for row in constituencyreader:
            jsonfile.write('{\n    "Constituency_Name": "')
            jsonfile.write(row['Constituency_Name'])
            jsonfile.write('",\n    ')
            jsonfile.write('"Constituency_Number": ')
            jsonfile.write(row['Constituency_Number'])
            jsonfile.write(',\n    ')
            jsonfile.write('"countInfo": ')
            json.dump(row, jsonfile)
            jsonfile.write('\n    }')

    jsonfile.write('\n    ]\n}')
    print jsonName, ' saved'
