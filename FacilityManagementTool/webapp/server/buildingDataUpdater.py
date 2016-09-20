#!/usr/bin/python
from apscheduler.schedulers.blocking import BlockingScheduler
import csv
import urllib2

#This class fetches the current raumliste.csv containing the building, florr and room information
#according the universiy of regensburg from the UR servers
#This process is repeated every 24 hours
class buildingDataUpdater():

	#Fetch the csv file that contains the building, floor and room data
	def fetchData():
		url = 'http://winterolympicsmedals.com/medals.csv'
		response = urllib2.urlopen(url)
		cr = csv.reader(response)

		#Save the fetched csv file locally
		with open('../csv/testRaumliste.csv', 'w') as mycsvfile:
			thedatawriter = csv.writer(mycsvfile, dialect='excel')
			for row in cr:
				thedatawriter.writerow(row)

	#Repeat the fetch process after 24 hours
	scheduler = BlockingScheduler()
	scheduler.add_job(fetchData, 'interval', seconds=20)
	scheduler.start()