import csv
import json
import os

jsonName = '../NI/full-candidates-list.json'

candidatefile = open('../NI/full-candidates.csv', 'rb')
jsonfile = open(jsonName, 'wb')

candidatefields = csv.reader(candidatefile).next()
candidatereader = csv.DictReader(candidatefile, candidatefields)
jsonfile.write('[')

for row in candidatereader:
    if candidatereader.line_num == 1:
        continue #skip header row
    if candidatereader.line_num != 2:
        jsonfile.write(',\n')
    json.dump(row, jsonfile, indent = 4, separators = (', ',': '))
    print row

jsonfile.write(']')
