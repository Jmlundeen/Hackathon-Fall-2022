# -*- coding: utf-8 -*-
#list of polled temps, approachval, size of array
def secleft (t,a,s):
    sumx = sumy = sumxy = sumxsq = sumysq = bz = bo = 0.0
    for i in range(s):
        sumx += t[i]
        sumy += i+1
        sumxy += t[i]*(i+1)
        sumxsq += t[i]*t[i]
        sumysq += (i+1)*(i+1)
    bz = ((sumy*sumxsq) - (sumx*sumxy)) / ((s*(sumxsq)) - (sumx*sumx))
    bo = ((s*sumxy)-(sumx*sumy)) / ((s*sumxsq) - (sumx*sumx))
    return (bz + (a*bo)) - s
  
        
