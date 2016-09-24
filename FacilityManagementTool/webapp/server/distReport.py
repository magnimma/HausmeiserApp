#!/usr/bin/python
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

webFormularUrl = "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/index.php"
data = {}

class distReporter(object):

	def fill_form_nds(self, data):
		distReporter().find_by_xpath('//input[@name = "nds"]').send_keys(data['nds'])

		return self # makes it so you can call .submit() after calling this function

	def fill_form_user(self, data):
		distReporter().find_by_xpath('//input[@name = "tf"]').send_keys(data['tf'])

		return self # makes it so you can call .submit() after calling this function

	def fill_form_disturbance(self, data):
		distReporter().find_by_xpath('//select[@name = "Gebaeude"]').send_keys(data['gebaeude'])
		distReporter().find_by_xpath('//select[@name = "Etage"]').send_keys(data['etage'])
		distReporter().find_by_xpath('//select[@name = "Raum"]').send_keys(data['raum'])
		distReporter().find_by_xpath('//select[@name = "fachgruppe"]').send_keys(data['fachgruppe'])
		distReporter().find_by_xpath('//textarea[@name = "Nachricht"]').send_keys(data['nachricht'])

		return self # makes it so you can call .submit() after calling this function

	def submit(self, fieldNumber):
		driver.find_element_by_xpath('(//input[@name = "gesendet"])[' + str(fieldNumber) + ']').click()

	def submitDisturbance(self):
		driver.find_element_by_xpath('(//input[@name = "Send"])').click()


	def find_by_xpath(self, locator):
		element = WebDriverWait(driver, 10).until(
			EC.presence_of_element_located((By.XPATH, locator))
		)
		return element

	def reportDisturbance(self, userNDS, userPhone, building, floor, room, specialGroup, description):
		data['nds'] = userNDS
		data['tf'] = userPhone
		data['gebaeude'] = building
		data['etage'] = floor
		data['raum'] = room
		data['fachgruppe'] = specialGroup
		data['nachricht'] = description
		print data
		global driver
		#driver = webdriver.Firefox() ##Fill form fields with browser using Firefox browser
		driver = webdriver.PhantomJS() #Fill form fields without browser using PhantomJS
		driver.get(webFormularUrl)
		driver.save_screenshot('debug_screen1.png')
		distReporter().fill_form_nds(data).submit(1)
		driver.save_screenshot('debug_screen2.png')
		distReporter().fill_form_user(data).submit(2)
		driver.save_screenshot('debug_screen3.png')
		distReporter().fill_form_disturbance(data)#.submitDisturbance() Auskommentieren zum Abschicken der Meldung
		driver.save_screenshot('debug_screen4.png')

		return "Disturbance submitted"