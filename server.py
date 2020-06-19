#!/usr/bin/python3.7
# -*- coding: utf-8 -*-

import logging, random, os, openpyxl, sys, math, smtplib, sys
from flask import Flask, render_template, request, flash, redirect, send_from_directory
from email import encoders
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate


ROOT = os.path.split(os.path.abspath(__file__))[0]
adminEmail = 'a-horohorin@mail.ru'

application = Flask(__name__)
orders = dict()
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
def getPostJavascriptData():
    log.info(request.form)
    if (request.form['action'] == 'get_results'):
        sess = str(random.randint(1, 10**18));
        d = parse(request.form)
        if (d == 'Введены не все данные, или данные не корректны'):
            return d;
        cost = calcCost(d)
        cost = str("{0:.2f}".format(cost))
        orders[sess] = cost
        return "<h3> Итоговая стоимость заказа: " + cost + " рублей</h3>" + "<div class='center' data-order='%s'> <span class='btn order'> Oформить заявку </span> </div>" % sess
    else:
        sess = request.form['uorder']
        sendEmail(request.form['umail'], sess, os.path.join(ROOT, 'static', 'blank.xls'))
        sendEmail(adminEmail, sess, os.path.join(ROOT, 'static', 'blank.xls'), request.form)
        return "kek"

def parse(jsdata):
    def getMaterial(s):
        if s == 'ЛДСП16':
            return 16
        elif s == 'ЛДСП26':
            return 26
        else:
            return 4

    def getName(s):
        name = s[10:-1]
        return name

    def getRadius(s):
        if s[-1] == '0':
            return float(s[-2:])
        else:
            return float(s[0:2])
    if jsdata['params[material]'] == '':
        return "Введены не все данные, или данные не корректны"
    d = {'material' : getMaterial(jsdata['params[material]']), 'details' : []}
    for i in jsdata:
        if 'detail' not in i:
            continue
        if 'type' in i:
            d['details'].append({})
            continue
        ind = int(i[7]) // 4 - 1
        if jsdata[i] == '':
            return "Введены не все данные, или данные не корректны"
        if getName(i)[0] == 'a':
            d['details'][ind][getName(i)] = getRadius(jsdata[i])
        else:
            d['details'][ind][getName(i)] = float(jsdata[i])
    return d

def sendEmail(adress, sess, file, form = 0):
    from_addr = 'andrew.khorokhorin@gmail.com'
    msg = MIMEMultipart()
    msg["From"] = from_addr
    msg["Subject"] = "Заказ на сервисе khaser.cf"
    msg["Date"] = formatdate(localtime=True)

    if (form != 0):
        data = '''
            Поступил новый заказ на сумму: %s
            Имя: %s
            Телефон: %s
            Email: %s
            Номер заказа: %s
            Комментарий: %s
        ''' % (orders[sess], form['uname'], form['uphone'], form['umail'], sess, form['ucomment'])
        msg.attach(MIMEText(data))
    else:
        msg.attach(MIMEText("Ваш заказ " + sess + " отправлен на рассмотрение и подтверждение"))

    msg["To"] = adress

    attachment = MIMEBase('application', "octet-stream")

    with open(file, "rb") as fh:
        data = fh.read()

    attachment.set_payload( data )
    encoders.encode_base64(attachment)
    header = 'Content-Disposition', 'attachment; filename="%s"' % file
    attachment.add_header(*header)
    msg.attach(attachment) 

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_addr, 'Azod10042003')
    server.sendmail(from_addr, adress, msg.as_string())
    server.quit()


def calcCost(d):
    material = d['material']
    a = d['details']
    S, p04, p2, paz1, paz2, R, Rless, Rmore, R1, R2 = [0 for i in range(10)]
    u, v, w, x = [[0 for i in range(len(a))] for i in range(4)]
    cnt = -1

    def inRange(x, a, b):
        return a <= x and x <= b

    for i in a:
        cnt += 1
        S += (i['width'] * i['length'] * i['cnt'] / 10 ** 6)
        p04 += (((i['lengthtop'] == 1) + (i['lengthbottom'] == 1)) * i['length'] + ((i['widthtop'] == 1) + (i['widthbottom'] == 1)) * i['width']) * i['cnt'] / 1000
        p2 += (((i['lengthtop'] == 2) + (i['lengthbottom'] == 2)) * i['length'] + ((i['widthtop'] == 2) + (i['widthbottom'] == 2)) * i['width']) * i['cnt'] / 1000
        paz1 += (i['paz'] == 1) * i['cnt']
        paz2 += (i['paz'] == 2) * i['cnt']
        if (i['a1'] > 0 and i['a3'] == 0):
            u[cnt] += (i['length'] + i['width'])
        else:
            if (i['a1'] > 0 and i['a3'] > 0):
                u[cnt] += (i['length'])
        
        if (i['a2'] > 0 and i['a1'] == 0):
            v[cnt] += (i['length'] + i['width'])
        else:
            if (i['a2'] > 0 and i['a1'] > 0):
                v[cnt] += (i['width'])

        if (i['a4'] > 0 and i['a2'] == 0):
            w[cnt] += (i['length'] + i['width'])
        else:
            if (i['a4'] > 0 and i['a2'] > 0):
                w[cnt] += (i['length'])

        if (i['a3'] > 0 and i['a4'] == 0):
            x[cnt] += (i['length'] + i['width'])
        else:
            if (i['a3'] > 0 and i['a4'] > 0):
                x[cnt] += (i['width'])
        r = u[cnt] + v[cnt] + w[cnt] + x[cnt]
        R += r * i['cnt'] / 1000

        for j in range(1, 5):
            if (inRange(int(i['a' + str(j)]), 1, 249)):
                Rless += i['cnt']
        for j in range(1, 5):
            if (int(i['a' + str(j)]) >= 250):
                Rmore += i['cnt']

        if ((u[cnt] or v[cnt]) and i['lengthtop'] == 1):
            R1 += i['length']
        if ((w[cnt] or x[cnt]) and i['lengthbottom'] == 1):
            R1 += i['length']
        if ((v[cnt] or w[cnt]) and i['widthtop'] == 1):
            R1 += i['width']
        if ((x[cnt] or u[cnt]) and i['widthbottom'] == 1):
            R1 += i['width']

        if ((u[cnt] or v[cnt]) and i['lengthtop'] == 2):
            R2 += i['length']
        if ((w[cnt] or x[cnt]) and i['lengthbottom'] == 2):
            R2 += i['length']
        if ((v[cnt] or w[cnt]) and i['widthtop'] == 2):
            R2 += i['width']
        if ((x[cnt] or u[cnt]) and i['widthbottom'] == 2):
            R2 += i['width']

    R1 /= 1000
    R2 /= 1000

    res = 0
    if (material == 16):
        res += S * 370 * 1 + 70 * S
    if (material == 26):
        res += S * 450 * 1 + 90 * S
    if (material == 4):
        res += S * 150 * 1 + 25 * S

    res += Rless * 120
    res += Rmore * 250

    if (material == 16):
        res += (p04 - R1) * 33 + (p2 - R2) * 66
    if (material == 26):
        res += (p04 - R1) * 55 + (p2 - R2) * 150

    if (material == 16):
        res += R1 * 59 + R2 * 101
    if (material == 26):
        res += R1 * 109 + R2 * 296

    res += paz1 * 20 + paz2 * 40
    res += math.ceil(S / 5) * 120
    return res


def main():
	application.run(host='0.0.0.0', debug=True, port=80)

if __name__ == "__main__":
	main()
