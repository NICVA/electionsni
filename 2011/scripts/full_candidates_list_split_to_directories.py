import csv, itertools as it, operator as op

csv_contents = []
with open('../NI/full-candidates-list.csv', 'rb') as full:
  dict_reader = csv.DictReader(full)   # default delimiter is comma
  fieldnames = dict_reader.fieldnames # save for writing
  for line in dict_reader:
    csv_contents.append(line)

# input to itertools.groupby must be sorted by the grouping value 
sorted_csv_contents = sorted(csv_contents, key=op.itemgetter('Constituency_Number'))

for groupkey, groupdata in it.groupby(sorted_csv_contents, 
                                      key=op.itemgetter('Directory')):
  with open('../constituency/{:s}/Candidate.csv'.format(groupkey), 'wb') as new:
    dict_writer = csv.DictWriter(new, fieldnames=fieldnames)
    dict_writer.writeheader()         # new method in 2.7; use writerow() in 2.6
    dict_writer.writerows(groupdata)
    print "Created", new.name

