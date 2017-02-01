## Looks through each /consituency/[Directory] for the ConstituencyCount.csv file
## Creates /NI/all-constituenc-info.json which has an object for each constituency with an array of the countInfo
## JSON used to supplement info displays and data reads on the website for each constituency

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
            jsonfile.write('"Directory": "')
            jsonfile.write(con)
            jsonfile.write('",\n    ')
            jsonfile.write('"countInfo": ')
            json.dump(row, jsonfile)
            jsonfile.write('\n    }')

    jsonfile.write('\n    ]\n}\n')
    print jsonName, ' saved'
