import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

data = pd.read_csv('./tx_output/baseline.csv')
baseline = data['Non-Extractable'].values
total_flows = data['Total Flows'].values

# X = [i for i in range(1,5)]
# Y = [baseline[i] for i in X]

# plt.plot(X,Y,marker='.')
# plt.xticks(X)
# plt.grid(True)
# plt.xlabel('Epoch Number')
# plt.ylabel('Number of Non-Extractable flows')
# plt.title('Baseline')
# plt.show()

epochs = 4

temp = ['0.1','0.2','0.4','0.8','1','2','4','6','8','10','20','40']

cia_files = ['cia_' + j +'.csv'  for j in temp]
rand_files = ['rand_' + j +'.csv'  for j in temp]
attack = 'CIA Attack'

X = temp

for j in range(1,epochs+1):
    Y = []
    for file in cia_files:
        data = pd.read_csv('./tx_output/cia_files/'+ file)
        total = data['Non-Extractable'].values[j] + data['Extractable'].values[j]
        Y.append((100 * data['Non-Extractable'].values[j])/total)

    Y1 = []
    for file in rand_files:
        data = pd.read_csv('./tx_output/rand_files/'+ file)
        total = data['Non-Extractable'].values[j] + data['Extractable'].values[j]
        Y1.append((100 * data['Non-Extractable'].values[j])/total)

    # Y_baseline = [baseline[j] for i in X]

    

    # print(X)
    # print(Y)
    # print(Y_baseline)

    plt.plot(X,Y,color='red',label=attack)
    plt.plot(X,Y1,color='blue',label='Random Attack')
    # plt.plot(X,Y_baseline,color='green',label='Baseline')

    plt.xticks(X)
    plt.legend()
    plt.grid(True)
    plt.xlabel('% of Attack Flows')
    plt.ylabel('Percentage of Non-Extractable flows')
    plt.title('At Epoch ' + str(j))
    plt.savefig('percentage_cia_rand_epoch_' + str(j) + '.png')
    plt.close()

