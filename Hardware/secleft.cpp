//this works, do not touch unless it's to change types
//array, approachval, size of array
int secleft (int t[], int a, int s) {
  //these all have to be floats so I can do proper linreg on them
  float sumx, sumy, sumxy, sumxsq, sumysq, bz, bo;
  sumx = sumy = sumxy = sumxsq = sumysq = bz = bo = 0.0;
  //I can't check for unintialized values (because UB), so s needs to be how many seconds have passed (i.e, how many polls we have)
  for (int i = 0; i < s; i++) {
    sumx += t[i];
    sumy += i+1;
    sumxy += t[i]*(i+1);
    sumxsq += t[i]*t[i];
    sumysq += (i+1)*(i+1);
  }
  bz = ((sumy*sumxsq) - (sumx*sumxy)) / ((s*(sumxsq)) - (sumx*sumx));
  bo = ((s*sumxy)-(sumx*sumy)) / ((s*sumxsq) - (sumx*sumx));
  return int((bz + (a*bo)) - float(s)); //gotta subtract number of seconds that have passed
  //wrapped for arduino's pleasure
  //maybe we don't need the explicit type conversion, but I'm gonna use it anyway
}
