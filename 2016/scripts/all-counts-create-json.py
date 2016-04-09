import csv
import json
import os

constituencies = ["belfast-east","belfast-north","belfast-south","belfast-west","east-antrim","east-londonderry","fermanagh-south-tyrone","foyle","lagan-valley","mid-ulster","newry-armagh","north-antrim","north-down","south-antrim","south-down","strangford","upper-bann","west-tyrone"]

for con in constituencies:
    constituencyfileName = '../constituency/' + con + '/ConstituencyCount.csv'
    countfileName = '../constituency/' + con + '/Count.csv'
    jsonName = '../constituency/' + con + '/ResultsJson.json'
    constituencyfile = open(constituencyfileName, 'r')
    countfile = open(countfileName, 'r')
    jsonfile = open(jsonName, 'wb')

    constituencyfields = csv.reader(constituencyfile).next()
    countfields = csv.reader(countfile).next()
    
    constituencyreader = csv.DictReader(constituencyfile, constituencyfields)
    for row in constituencyreader:
        jsonfile.write('{"Constituency": {"countInfo": ')
        json.dump(row, jsonfile)
        jsonfile.write(',\n"countGroup": [')

    countreader = csv.DictReader(countfile, countfields)
    i=0
    for row in countreader:
        if countreader.line_num != 1:
            jsonfile.write(',\n')
        row['id'] = i
        i += 1
        json.dump(row, jsonfile, indent = 4, separators = (', ',': '))

    jsonfile.write(']}}')
    print jsonName, ' saved'
