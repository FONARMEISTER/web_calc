#!/usr/bin/python3.7
# -*- coding: utf-8 -*-

import logging, random, os, openpyxl, sys
from flask import Flask, render_template, request, flash, redirect, send_from_directory


ROOT = os.path.split(os.path.abspath(__file__))[0]

application = Flask(__name__)
application.secret_key = "abracadabra"
log = logging.getLogger(__name__)
logging.basicConfig(level = logging.DEBUG, format = "> %(asctime)-15s %(levelname)-8s || %(message)s")

@application.route("/")
def index():
	return render_template("index.html")

def main():
	application.run(host='0.0.0.0', debug=True, port=80)

if __name__ == "__main__":
	main()
