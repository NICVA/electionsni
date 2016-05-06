## Similar to all-counts-find-elected.py but adds party colours to create d3-elected.json
## Data in this used to populate the d3 results hexagon visualisation

import csv
import json
import os
import operator as op
import itertools as it

reference = open('../NI/constituencies.csv', 'r')
constituencyfields = csv.reader(reference).next()
constituencyReader = csv.DictReader(reference, constituencyfields)
constituencies = []
constituencyNames = []

others = open('../NI/other-elected.csv', 'r')
others_fields = csv.reader(others).next()
others_reader = csv.DictReader(others, others_fields)
others_ids = []
for line in others_reader:
    others_ids.append(line['Candidate_Id'])

for d in constituencyReader:
    constituencies.append(d['Directory'])
    constituencyNames.append(d['Constituency_Name'])
    
jsonMain = '../NI/all-elected-d3.json'

c = 0
e = 0
with open(jsonMain, 'wb') as main:
    main.write('[\n')
    for con in constituencies:
 
        countName = '../constituency/' + con + '/Count.csv'
        elected = []
        constituencyName = constituencyNames[c]
        
        reference = open('../NI/constituencies.csv', 'r')
        constituencyfields = csv.reader(reference).next()
        constituencyReader = csv.DictReader(reference, constituencyfields)
        
        countfile = open(countName, 'r')
        countfields = csv.reader(countfile).next()
        countreader = csv.DictReader(countfile, countfields)

        csv_contents = []
        for line in countreader:
            csv_contents.append(line)

        new = []
        grouped = it.groupby(csv_contents, key=op.itemgetter('Count_Number'))
        for k,g in grouped:
            key = k
            
        grouped = it.groupby(csv_contents, key=op.itemgetter('Count_Number'))
        for k, g in grouped:
            if key == k:
                for r in g:
                    new.append(r)
        
        for row in new:
            partiescsv = open('../NI/parties.csv', 'r')
            partiesfields = csv.reader(partiescsv).next()
            partiesReader = csv.DictReader(partiescsv, partiesfields)
            for option in partiesReader:
                if option['Party_Name'] == row['Party_Name']:
                    colour = option['Hex_Col']
            row['Constituency_Name'] = constituencyName
            row['Colour'] = colour
            del row['Transfers']
            del row['Count_Number']
            del row['Total_Votes']
            if row['Status'] == 'Elected':
                if e != 0:
                    main.write(',\n')
                json.dump(row, main, indent =4, separators= (', ',': '))
                elected.append(row)
                
                e += 1
            elif row['Candidate_Id'] in others_ids:
                if e != 0:
                    main.write(',\n')
                json.dump(row, main, indent =4, separators= (', ',': '))
                e += 1
        c += 1
    main.write('\n]\n')
    print 'Found', e, 'elected candidates across', c, 'constituencies'
