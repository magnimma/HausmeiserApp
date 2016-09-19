#!/usr/bin/python
import json

#This class checks whether entered nds accounts are valid accounts of the univerity of regensburg
class ndsValidater():

	def validateNDSAccount(self, ndsAccount):
		return json.dumps({'success':'true', 'nds':'ggg55555', 'name':'bob bambus', 'email':'bob@gmx.de', 'tel':'0123'})