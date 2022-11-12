from flask import Flask
from flask_cors import CORS  # This is the magic
# import serial

app = Flask(__name__)
CORS(app)
# #COM3
heatThreshold = 0
naturalTempIncrease = False
currentTemperature = 0

# # configure the serial connections (the parameters differs on the device you are connecting to)
# ser = serial.Serial()
# ser.baudrate = 9600
# ser.port = 'COM3'
# ser.open()


@app.route("/setAlarm/<int:threshold>/<int:naturalIncrease>")
def setAlarm(threshold, naturalIncrease):
    heatThreshold = threshold
    naturalTempIncrease = naturalIncrease
    return "Successfully set up alarm!"

@app.route("/getInfo")
def getThreshold():
    # output = ser.readline()
    # print(output)
    alarmActivated = False
    if naturalTempIncrease == True:
        alarmActivated = currentTemperature > heatThreshold 
    else:
        alarmActivated = currentTemperature < heatThreshold
    result = {
        "currentTemperature": currentTemperature,
        "alarmActivated": alarmActivated,
        "eta": 1964
    }
    return result
app.run(debug=True)
