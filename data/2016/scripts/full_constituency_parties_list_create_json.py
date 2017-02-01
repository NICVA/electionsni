import csv
import json
import os
import itertools as it
import operator as op

jsonName = '../NI/all-party-candidates.json'

candidatefile = open('../NI/full-candidates-list.csv', 'rb')

candidatefields = csv.reader(candidatefile).next()
candidatereader = csv.DictReader(candidatefile, candidatefields)

csv_contents = []
for line in candidatereader:
    csv_contents.append(line)

# Sort contents by constituency id number
sorted_csv_contents = sorted(csv_contents, key=op.itemgetter('Party_Name', 'Surname'))

with open (jsonName, 'wb') as new:

    new.write('{\n')
    new.write('"Parties": [\n')

    c = 1
    for groupkey, groupdata in it.groupby(sorted_csv_contents, 
                                      key=op.itemgetter('Party_Name','Party_Id')):
        if c != 1:
            new.write(',\n')
        c +=1
        new.write('    {\n    "Party_Name": "')
        new.write(groupkey[0])
        new.write('",\n')
        new.write('    "Party_Number": "')
        new.write(groupkey[1])
        new.write('",\n')
        new.write('    "Candidates": [')

        i = 1
        for row in groupdata:
            if i != 1:
                new.write(',')
            new.write('\n    ')
            new.write(json.dumps(row, indent = 8, separators = (', ',': ')))
            i += 1
            
        new.write('\n    ]}')

    new.write('\n]}')

print 'created ' + jsonName
