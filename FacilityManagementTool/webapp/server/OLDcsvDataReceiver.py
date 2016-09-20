#!/usr/bin/python
import csv
import urllib2

class csvDataReceiver():

	def receiveData(self):
		url = 'http://winterolympicsmedals.com/medals.csv'
		response = urllib2.urlopen(url)
		cr = csv.reader(response)

		with open('../csv/testRaumliste.csv', 'w') as mycsvfile:
			thedatawriter = csv.writer(mycsvfile, dialect='excel')
			for row in cr:
				thedatawriter.writerow(row)

	def test(self):
		print "FETCH TEST"