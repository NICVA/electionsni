import csv
import json
import os
import operator as op
import itertools as it

constituencies = ["belfast-east","belfast-north","belfast-south","belfast-west","east-antrim","east-londonderry","fermanagh-south-tyrone","foyle","lagan-valley","mid-ulster","newry-armagh","north-antrim","north-down","south-antrim","south-down","strangford","upper-bann","west-tyrone"]
jsonMain = '../NI/all-elected.json'

others = open('../NI/other-elected.csv', 'r')
others_fields = csv.reader(others).next()
others_reader = csv.DictReader(others, others_fields)
others_ids = []
for line in others_reader:
  others_ids.append(line['Candidate_Id'])

with open(jsonMain, 'wb') as main:
    main.write('{"Constituencies": [\n')
    c = 0
    for con in constituencies:
        if c != 0:
            main.write(',\n')

        countName = '../constituency/' + con + '/Count.csv'
        jsonName = '../constituency/' + con + '/ElectedJson.json'

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
                    e += 1
                elif row['Candidate_Id'] in others_ids:
                    if e != 0:
                        confile.write(',\n')
                        main.write(',\n')
                    json.dump(row, confile, indent = 4, separators = (', ',': '))
                    json.dump(row, main, indent =4, separators= (', ',': '))
                    e += 1
            confile.write(']')
        main.write(']\n}')
        c += 1

        print jsonName, ' saved', e, ' elected'
    main.write('\n]}\n')
    print jsonMain, ' saved'
