## Iterates throuhg each /constituency/[Directory] for the Count.csv file.
## From the csv, groups each count and determines the last (most recent)
## From the 'status' field, determines which candidates have been elected
## Writes candidate information to /constituency/[Directory]/Elected.csv
## Also, creates /NI/all-elected.json, which has details of all candidates elected
## Used during the live count run, i.e. can find candidates elected so-far, before the full count is finished

import csv
import json
import os
import operator as op
import itertools as it

constituencies = ["belfast-east","belfast-north","belfast-south","belfast-west","east-antrim","east-londonderry","fermanagh-south-tyrone","foyle","lagan-valley","mid-ulster","newry-armagh","north-antrim","north-down","south-antrim","south-down","strangford","upper-bann","west-tyrone"]
jsonMain = '../NI/all-elected.json'

with open(jsonMain, 'wb') as main:
    main.write('{"Constituencies": [\n')
    c = 0
    for con in constituencies:
        if c != 0:
            main.write(',\n')
            
        countName = '../constituency/' + con + '/Count.csv'
        jsonName = '../constituency/' + con + '/ElectedJson.json'
        csvName = '../constituency/' + con + '/Elected.csv'
        elected = []

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

        for option in constituencyReader:
            if option['Directory'] == con:
                name = option['Constituency_Name']
        main.write('{"Constituency_Name": "')
        main.write(name)
        main.write('",\n"Constituency_Number": ')
        main.write(line['Constituency_Number'])
        main.write(',\n"Elected": [\n')
        
        e = 0
        with open(jsonName, 'wb') as confile:
            confile.write('[\n')
            for row in new:
                del row['Transfers']
                del row['Count_Number']
                del row['Total_Votes']
                if row['Status'] == 'Elected':
                    if e != 0:
                        confile.write(',\n')
                        main.write(',\n')
                    json.dump(row, confile, indent = 4, separators = (', ',': '))
                    json.dump(row, main, indent =4, separators= (', ',': '))
                    elected.append(row)
                    
                    e += 1
            confile.write(']')
        main.write(']\n}')
        c += 1
        
        with open(csvName, 'wb') as csvfile:
            wr = csv.DictWriter(csvfile, elected[0].keys())
            wr.writeheader()
            wr.writerows(elected)
        
        print jsonName, ' saved', e, ' candidates elected'
    main.write(']}')
    print jsonMain, ' saved'
