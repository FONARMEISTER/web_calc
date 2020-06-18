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

@application.route("/upload", methods = ['POST'])
def upload():
	return send_from_directory('static', "blank.xls", as_attachment=True)


@application.route("/dropdown-arrow-disabled.png")
def dropdown():
	return send_from_directory(os.path.join(application.root_path, 'static'), 'dropdown-arrow-disabled.png', mimetype='image/png')

@application.route("/img/icons.png")
def icons():
	return send_from_directory(os.path.join(application.root_path, 'static'), 'icons.png', mimetype='image/png')

@application.route('/', methods = ['POST'])
def get_post_javascript_data():
    # jsdata = request.form['params']
    print(request.form)
    if (request.form['action'] == 'get_results'):
        sess = random.randint(1, 10**18);
        return "<h3> Итоговая стоимость заказа: " + 'TODO' + "</h3>" + "<div class='center' data-order='%s'> <span class='btn order'> Oформить заявку </span> </div>" % sess
    else:
        sess = request.form['uorder']
        print(sess)
        return "kek"



def main():
	application.run(host='0.0.0.0', debug=True, port=80)

if __name__ == "__main__":
	main()
