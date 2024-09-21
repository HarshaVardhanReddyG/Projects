import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

data = pd.read_csv('./tx_output/baseline.csv')
baseline = data['Non-Extractable'].values
epoch = 4
attack = 'Random Attack'

temp = ['0.1','0.2','0.4','0.8','1','2','4','6','8','10','20','40']

cia_files = ['cia_' + j +'.csv'  for j in temp]
rand_files = ['rand_' + j +'.csv'  for j in temp]


X = [i for i in range(5)]

for j in range(len(rand_files)):
    data = pd.read_csv('./tx_output/rand_files/'+ rand_files[j])
    Y = data['Non-Extractable'].values

    Y_baseline = [baseline[i] for i in X]

    print(X)
    print(Y)
    print(Y_baseline)

    plt.plot(X,Y,color='red',label=attack)
    plt.plot(X,Y_baseline,color='blue',label='Baseline')

    plt.xticks(X)
    plt.legend()
    plt.grid(True)
    plt.xlabel('Epoch Number')
    plt.ylabel('Number of Non-Extractable flows')
    plt.title(temp[j] + '% ' + attack)
    plt.savefig('./rand_plots/rand_' + temp[j] + '.png')
    plt.close()
    # plt.show()