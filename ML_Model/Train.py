import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split as tts
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
import pickle
import sys

val=sys.argv()
path=val[1]
data=pd.read_csv(path)
data=np.array(data)
X=data[:,0:10]
Y=data[:,10]
X_train, X_test, Y_train, Y_test = tts(X, Y, test_size=0.2, random_state=0)
knn = KNeighborsRegressor(n_neighbors=13)
knn.fit(X_train,Y_train)
print(knn.score(X_test,Y_test))
pickle.dump(knn, open('Model.pkl','wb'))