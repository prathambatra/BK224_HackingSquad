import numpy as np
import pandas as pd
import pickle

model = pickle.load(open('Model.pkl', 'rb'))

val=sys.argv()
path=val[0]
data=pd.read_csv(path)
data=np.array(data)
X=data[:,0:10]
pred=model.predict(X)
print(pred)