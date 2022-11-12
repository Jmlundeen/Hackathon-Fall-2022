from flask import Flask
from flask_cors import CORS  # This is the magic
import serial

heatThreshold = 28
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
ser.baudrate = 9600
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
    print("sumxsq " + str(sumxsq))
    print("sumx " + str(sumx))
    print("s " + str(s))
    bz = ((sumy*sumxsq) - (sumx*sumxy)) / ((s*(sumxsq)) - (sumx*sumx))
    bo = ((s*sumxy)-(sumx*sumy)) / ((s*sumxsq) - (sumx*sumx))
    return (bz + (a*bo)) -s 

@app.route("/setAlarm/<threshold>/<naturalIncrease>",methods=['POST'])
def setAlarm(threshold,naturalIncrease):
    global heatThreshold, naturalTempIncrease
    heatThreshold = float(threshold)
    naturalTempIncrease = naturalIncrease == 0 if False else True
    return "Successfully set up alarm!"

@app.route("/getInfo")
def getThreshold():
    global tempHistory, eta, currentTemperature, alarmActivated, heatThreshold, previousTemp
    try:
        output = ser.readline().decode("utf-8").strip().split(",")
        currentTemperature = float(output[0])
        if abs(currentTemperature - previousTemp) < 10:
            tempHistory.append({'temp': currentTemperature, 'name': output[1]})
            currentTemperature = previousTemp
        if(len(tempHistory) > 5):
            if(len(tempHistory) > 20):
                tempHistory = tempHistory[1:]
            eta = secleft(tempHistory, heatThreshold, len(tempHistory))
        alarmActivated = False
        if naturalTempIncrease == True:
            alarmActivated = currentTemperature > heatThreshold 
        else:
            alarmActivated = currentTemperature < heatThreshold
        result = {
            "currentTemperature": currentTemperature,
            "targetTemperature": heatThreshold,
            "tempHistory": tempHistory,
            "alarmActivated": alarmActivated,
            "eta": eta
        }
        previousTemp = float(output[0])
        return result
    except:
        result = {
            "currentTemperature": 20,
            "targetTemperature": 20,
            "tempHistory": [],
            "alarmActivated": 0,
            "eta": 0
        }
        return result
app.run(debug=True)
