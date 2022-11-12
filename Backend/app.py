from flask import Flask
from flask_cors import CORS  # This is the magic
import serial
from scipy import stats

heatThreshold = 0
naturalTempIncrease = False
currentTemperature = 0
eta = 0
tempHistory = []
previousTemp = 0
x = []
y = []
slope = 0
intercept = 0

app = Flask(__name__)

CORS(app)
# #COM3

# # configure the serial connections (the parameters differs on the device you are connecting to)
ser = serial.Serial()
ser.baudrate = 115200
ser.port = 'COM8'
# ser.port = '/dev/tty.usbserial-0001'

ser.open()

# -*- coding: utf-8 -*-
#list of polled temps, approachval, size of array
def secleft ():
    r = 0
    p = 0
    std_err =0 
    global slope, intercept, heatThreshold,x,y
    print("x " )
    slope, intercept, r, p, std_err = stats.linregress(x, y)
    return slope*heatThreshold+intercept

@app.route("/setAlarm/<threshold>/<naturalIncrease>",methods=['POST'])
def setAlarm(threshold,naturalIncrease):
    global heatThreshold, naturalTempIncrease
    heatThreshold = float(threshold)
    naturalTempIncrease = naturalIncrease == 0 if False else True
    return "Successfully set up alarm!"

@app.route("/getInfo")
def getThreshold():
    ser.flush()
    global tempHistory, eta, currentTemperature, alarmActivated, heatThreshold, previousTemp,x,y
    output = ser.readline().decode("utf-8").strip().split(",")
    currentTemperature = float(output[0])
    if abs(currentTemperature - previousTemp) < 10:
        tempHistory.append({'temp': currentTemperature, 'name': output[1]})
        x.append(float(output[1]))
        y.append(float(currentTemperature))
    if(len(tempHistory) > 5):
        if(len(tempHistory) > 120):
            tempHistory = tempHistory[1:]
            x = x[1:]
            y = y[1:]
        eta = secleft()
    alarmActivated = False
    if naturalTempIncrease == True:
        alarmActivated = currentTemperature > heatThreshold 
    else:
        alarmActivated = currentTemperature < heatThreshold
    print(heatThreshold)
    result = {
        "currentTemperature": currentTemperature,
        "targetTemperature": heatThreshold,
        "tempHistory": tempHistory,
        "alarmActivated": alarmActivated,
        "eta": eta
    }
    print({'temp': currentTemperature, 'name': output[1]})
    previousTemp = currentTemperature
    return result
app.run(debug=True)
