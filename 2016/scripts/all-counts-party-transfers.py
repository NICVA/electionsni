

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

for d in constituencyReader:
    constituencies.append(d['Directory'])
    constituencyNames.append(d['Constituency_Name'])
    
jsonMain = '../NI/party-transfers.json'

c = 0
with open(jsonMain, 'wb') as main:
    main.write('[\n')
    for con in constituencies:
 
        countName = '../constituency/' + con + '/Count.csv'
        elected = []
        constituencyName = constituencyNames[c]
        if c != 0:
            main.write(',\n')
        c += 1
        main.write('\t{"Constituency_Name": "')
        main.write(constituencyName)
        main.write('", "Counts": \n\t\t[\n')
        
        reference = open('../NI/constituencies.csv', 'r')
        constituencyfields = csv.reader(reference).next()
        constituencyReader = csv.DictReader(reference, constituencyfields)
        
        countfile = open(countName, 'r')
        countfields = csv.reader(countfile).next()
        countreader = csv.DictReader(countfile, countfields)

        csv_contents = []
        for line in countreader:
            csv_contents.append(line)

        ## Find the counts in which there was a quantifiable transfers of votes
        ## i.e. only one candidate has votes transferred from them (negative
        ## number of transfers)
        ## And also grab the unique party names that are in the constituency
        count_nums = []
        parties = {}
        grouped = it.groupby(csv_contents, key=op.itemgetter('Count_Number'))
        for k, g in grouped:
            out = []
            for r in g:
                if r['Party_Name'] not in parties:
                    party_name = r['Party_Name']
                    parties[party_name] = '0'
                transfers = float(r['Transfers'])
                if transfers<0:
                    out.append(transfers)
            if len(out) == 1:
                count_nums.append(k)

        ## Now run through the counts again
        ## Have to sum transfers to for each party, not candidate
        e=0
        grouped = it.groupby(csv_contents, key=op.itemgetter('Count_Number'))
        for k, g in grouped:
            for p in parties:
                parties[p] = 0
            print parties
            if k in count_nums:
                if e != 0:
                    main.write(',\n')
                e += 1
                main.write('\t\t{"Count_Number": ')
                main.write(k)
                main.write(',\n\t\t\t"From": ')
                transfers_from = {}
                transfers_to = {}
                total_to = 0
                for r in g:
                    transfers = float(r['Transfers'])
                    if transfers<0:
                        total_from = transfers
                        party_from = r['Party_Name']
                        transfers_from[party_from] = transfers
                    elif transfers>0:
                        total_to = total_to + transfers
                        party_to = r['Party_Name']
                        total = float(parties.pop(party_to, 0)) + transfers
                        parties[party_to] = total
                json.dump(transfers_from, main)
                main.write(',\n\t\t\t"To": ')
                json.dump(parties, main)
                main.write(',\n\t\t\t"Not_transferred": ')
                Non = abs(total_from + total_to)
                main.write(str(Non))
                main.write('\n\t\t}')
                    
        main.write('\n\t\t]\n\t}\n')
    main.write(']')

print jsonMain, 'saved'
