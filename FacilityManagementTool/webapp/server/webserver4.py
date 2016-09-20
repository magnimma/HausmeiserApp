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

PORT_NUMBER = 8080

#This class will handle any incoming requests from
#the browser 
class myHandler(BaseHTTPRequestHandler):

	#Handler for the POST requests
	def do_POST(self):

		#Fetch and parse the given parameter
		postvars = self.parse_POST()
		print postvars
		print postvars['userNDS']
		print self.path

		#Check whether the POST request needs to validate a NDS account
		if self.path == "/nds":

			#Create an instance of the ndsValidater class and validate the nds account
			validater = ndsValidater()
			print validater.validateNDSAccount(postvars['param'])

			#Return the success response and the needed headers to the client
			self.send_response(200)
			self.send_header("Access-Control-Allow-Origin", "*")
			self.send_header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin")
			self.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
			self.end_headers()

			#Return the validation result to the client
			self.wfile.write(validater.validateNDSAccount(postvars['param']))
			return

		##Check whether the POST request needs to fetch the building data
		if self.path == "/submit":

			#Create an instance of the distReporter class and post the disturbance
			reporter = distReporter()
			#reporter.reportDisturbance()
			print "Submit disturbance"

			#Return the success response and the needed headers to the client
			self.send_response(200)
			self.send_header("Access-Control-Allow-Origin", "*")
			self.send_header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin")
			self.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
			self.end_headers()

			#Return an anwser to the client
			self.wfile.write(reporter.reportDisturbance())
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

try:
	#Create a web server and define the handler to manage the
	#incoming requests
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print 'Started httpserver on port ' , PORT_NUMBER

	#Wait forever for incoming http requests
	server.serve_forever()

except KeyboardInterrupt:
	print '^C received, shutting down the web server'
	server.socket.close()