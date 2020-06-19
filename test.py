#!/usr/bin/python3.7

from email import encoders
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate
import smtplib, sys

toEmail = sys.argv[1]
sess = sys.argv[2]
file_to_attach = sys.argv[3]

msg = MIMEMultipart()
msg["From"] = from_addr
msg["Subject"] = "Заказ на сервисе khaser.cf"
msg["Date"] = formatdate(localtime=True)

msg.attach(MIMEText("Ваш заказ " + sess + " отправлен на рассмотрение и подтверждение"))

msg["To"] = toEmail

attachment = MIMEBase('application', "octet-stream")

with open(file_to_attach, "rb") as fh:
    data = fh.read()

attachment.set_payload( data )
encoders.encode_base64(attachment)
header = 'Content-Disposition', 'attachment; filename="%s"' % file_to_attach
attachment.add_header(*header)
msg.attach(attachment) 

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(from_addr, 'Azod10042003')
server.sendmail(from_addr, toEmail, msg.as_string())
server.quit()
