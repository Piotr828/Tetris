import webview
def close():
    import os
    os._exit(0)

def rotade(T,d):
    if d not in [-1,1]:
        raise ValueError
    if len(T)!=4 or any(len(row)!=4 for row in T):
        raise ValueError
    if d==1:
        return [[T[3 - j][i] for j in range(4)] for i in range(4)]
    elif d==-1:
        return [[T[j][3 - i] for j in range(4)] for i in range(4)]
def print_rotaded(T,d):
    rotaded=rotade(T,d)
    for row in rotaded:
        print(row)
