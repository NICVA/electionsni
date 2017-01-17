## Iterates through each /constituency/[Directory] and creates ResultsJson.json
## ResultsJson.json is used to run the count stage visualisation

import csv
import json
import os

constituencyfileName = 'ConstituencyCount.csv'
countfileName = 'Count.csv'
jsonName = 'ResultsJson.json'
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
    print row
    if countreader.line_num != 1:
        jsonfile.write(',\n')
    row['id'] = i
    i += 1
    json.dump(row, jsonfile, indent = 4, separators = (', ',': '))

jsonfile.write(']}}')
print jsonName, ' saved'
