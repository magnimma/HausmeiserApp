#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from sys import version as python_version
from cgi import parse_header, parse_multipart
from urlparse import parse_qs
from BaseHTTPServer import BaseHTTPRequestHandler
from os import curdir, sep
import cgi
import csv
import json
import requests
from ndsValidation import *
from distReport import *
from csvDataReceiver import *

PORT_NUMBER = 8080

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):
	
	#Handler for the GET requests
	def do_GET(self):
		if self.path=="/":
			self.path="/index_example3.html"
			#self.dlRoomData()

		try:
			#Check the file extension required and
			#set the right mime type

			sendReply = False
			if self.path.endswith(".html"):
				mimetype='text/html'
				sendReply = True
			if self.path.endswith(".jpg"):
				mimetype='image/jpg'
				sendReply = True
			if self.path.endswith(".gif"):
				mimetype='image/gif'
				sendReply = True
			if self.path.endswith(".js"):
				mimetype='application/javascript'
				sendReply = True
			if self.path.endswith(".css"):
				mimetype='text/css'
				sendReply = True

			if sendReply == True:
				#Open the static file requested and send it
				f = open(curdir + sep + self.path) 
				self.send_response(200)
				self.send_header('Content-type',mimetype)
				self.end_headers()
				self.wfile.write(f.read())
				f.close()
			return

		except IOError:
			self.send_error(404,'File Not Found: %s' % self.path)

	#Handler for the POST requests
	def do_POST(self):

		#Fetch and parse the given parameter
		postvars = self.parse_POST()
		print postvars
		print postvars['param']

		#Create an instance of the distReporter class and post the disturbance
		#reporter = distReporter()
		#reporter.reportDisturbance()

		#Create an instance of the ndsValidater class and validate the nds account
		validater = ndsValidater()
		print validater.validateNDSAccount(postvars['param'])

		#Create an instance of the csvDataReceiver class and fetch the building, floor and room data
		receiver = csvDataReceiver()
		print receiver.receiveData()

		#Return the succes response and the needed headers to the client
		self.send_response(200)
		self.send_header("Access-Control-Allow-Origin", "*")
		self.send_header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin")
		self.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		self.end_headers()

		#Return the validation result to the client
		self.wfile.write(validater.validateNDSAccount(postvars['param']))

		if self.path=="/send":
			form = cgi.FieldStorage(
				fp=self.rfile, 
				headers=self.headers,
				environ={'REQUEST_METHOD':'POST',
		                 'CONTENT_TYPE':self.headers['Content-Type'],
			})
			print "Your name is: %s" % form["your_name"].value
			self.send_response(200)
			self.end_headers()
			self.wfile.write("Thanks %s !" % form["your_name"].value)
			self.wfile.write(self.path)
			return

	def parse_POST(self):
		ctype, pdict = parse_header(self.headers['content-type'])
		if ctype == 'multipart/form-data':
			postvars = parse_multipart(self.rfile, pdict)
		elif ctype == 'application/x-www-form-urlencoded':
			length = int(self.headers['content-length'])
			postvars = parse_qs(
					self.rfile.read(length),
					keep_blank_values=1)
		else:
			postvars = {}
		return postvars

	#Download the room data csv
	#CSV wird geladen aber wegen PW-Schutz kann die Raumliste.csv vom Uniserver nicht geladen werden
	def dlRoomData(self):

		CSV_URL = 'https://appsso.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/raumliste.csv'
		with requests.Session() as s:
			download = s.get(CSV_URL)

			decoded_content = download.content.decode('utf-8')
			print(decoded_content)
			cr = csv.reader(decoded_content.splitlines(), delimiter=',')


try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print 'Started httpserver on port ' , PORT_NUMBER
	
	#Wait forever for incoming htto requests
	server.serve_forever()

except KeyboardInterrupt:
	print '^C received, shutting down the web server'
	server.socket.close()
