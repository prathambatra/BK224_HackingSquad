import numpy as np
import pandas as pd
import pickle
import os
import sys

model = pickle.load(open(os.path.join('mlscripts', 'Model.pkl'), 'rb'))

path=sys.argv[1]
data=pd.read_csv(path)
data=np.array(data)
X=data[:,0:10]
pred=model.predict(X)
print(pred)