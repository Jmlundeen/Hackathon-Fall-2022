from flask import Flask
from flask_cors import CORS  # This is the magic
import serial

heatThreshold = 0
naturalTempIncrease = False
currentTemperature = 0
eta = 0
tempHistory = []
previousTemp = 0

app = Flask(__name__)

CORS(app)
# #COM3

# # configure the serial connections (the parameters differs on the device you are connecting to)
ser = serial.Serial()
ser.baudrate = 115200
# ser.port = 'COM8'
ser.port = 'COM8'

ser.open()

# -*- coding: utf-8 -*-
#list of polled temps, approachval, size of array
def secleft (t,a,s):
    sumx = sumy = sumxy = sumxsq = sumysq = bz = bo = 0.0
    for i in range(s):
        sumx += t[i]['temp']
        sumy += i+1
        sumxy += t[i]['temp']*(i+1)
        sumxsq += t[i]['temp']*t[i]['temp']
        sumysq += (i+1)*(i+1)
    print("a " + str(a))
    bz = ((sumy*sumxsq) - (sumx*sumxy)) / ((s*(sumxsq)) - (sumx*sumx))
    bo = ((s*sumxy)-(sumx*sumy)) / ((s*sumxsq) - (sumx*sumx))
    return (bz + (a*bo)) -s 

@app.route("/setAlarm/<threshold>/<naturalIncrease>",methods=['POST'])
def setAlarm(threshold,naturalIncrease):
    global heatThreshold, naturalTempIncrease
    heatThreshold = float(threshold)
    print("Inside")
    print(heatThreshold)
    naturalTempIncrease = naturalIncrease == 0 if False else True
    return "Successfully set up alarm!"

@app.route("/getInfo")
def getThreshold():
    ser.flush()
    global tempHistory, eta, currentTemperature, alarmActivated, heatThreshold, previousTemp
    # try:
    output = ser.readline().decode("utf-8").strip().split(",")
    # print(ser.readlines())
    currentTemperature = float(output[0])
    if abs(currentTemperature - previousTemp) < 10:
        tempHistory.append({'temp': currentTemperature, 'name': output[1]})
    if(len(tempHistory) > 5):
        if(len(tempHistory) > 120):
            tempHistory = tempHistory[1:]
        eta = secleft(tempHistory, heatThreshold, len(tempHistory))
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
    # except:
    #     result = {
    #         "currentTemperature": 999,
    #         "targetTemperature": 999,
    #         "tempHistory": [],
    #         "alarmActivated": 999,
    #         "eta": 999
    #     }
    #     return result
app.run(debug=True)
