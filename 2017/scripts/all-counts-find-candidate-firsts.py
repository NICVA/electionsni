import csv
import json
import os
import operator as op
import itertools as it

constituencies = ["belfast-east","belfast-north","belfast-south","belfast-west","east-antrim","east-londonderry","fermanagh-south-tyrone","foyle","lagan-valley","mid-ulster","newry-armagh","north-antrim","north-down","south-antrim","south-down","strangford","upper-bann","west-tyrone"]
jsonMain = '../NI/post-election-candidate-info.csv'
csv_to_write = []

for con in constituencies:
    countName = '../constituency/' + con + '/Count.csv'
    jsonName = '../constituency/' + con + '/ElectedJson.json'

    reference = open('../NI/constituencies.csv', 'r')
    constituencyfields = csv.reader(reference).next()
    constituencyReader = csv.DictReader(reference, constituencyfields)

    countfile = open(countName, 'r')
    countfields = csv.reader(countfile).next()
    countreader = csv.DictReader(countfile, countfields)

    contents = []
    for line in countreader:
        contents.append(line)

    new = []
    grouped = it.groupby(contents, key=op.itemgetter('Count_Number'))
    for k,g in grouped:
        key = k

    grouped = it.groupby(contents, key=op.itemgetter('Count_Number'))
    for k, g in grouped:
        if key == k:
            for r in g:
                new.append(r)

    for row in new:
        candidatesfile = open('../NI/full-candidates-list.csv', 'r')
        candidatesfields = csv.reader(candidatesfile).next()
        candidatesreader = csv.DictReader(candidatesfile, candidatesfields)
        for candidate in candidatesreader:
            if row['Candidate_Id'] == candidate['Candidate_Id']:
                newrow = dict(row, **candidate)
                csv_to_write.append(newrow)

with open(jsonMain, 'wb') as main:
    keys = newrow.keys()
    dict_writer = csv.DictWriter(main, keys)        # new method in 2.7; use writerow() in 2.6
    dict_writer.writeheader()
    others = open('../NI/other-elected.csv', 'r')
    others_fields = csv.reader(others).next()
    others_reader = csv.DictReader(others, others_fields)
    others_ids = []
    for line in others_reader:
       others_ids.append(line['Candidate_Id'])
    for line in csv_to_write:
       if line['Candidate_Id'] in others_ids:
           line['Status'] = 'Elected'
           print line
       dict_writer.writerow(line)
