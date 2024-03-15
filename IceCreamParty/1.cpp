#include <bits/stdc++.h>
#include<semaphore.h>

using namespace std;
using namespace std::chrono;

int k,m,n,a,b,l,u;
int c=0;
int *tot_wait;
int cook_wait=0;
atomic<int> num_trays=0;
//semaphores
sem_t trays;
int finish =1;
mutex mtx,mtx2;

//file handling
//declaring file
ofstream file("output.txt"); 

// to get system time
string getSysTime(){
    auto now = system_clock::now();
    auto now_ms = time_point_cast<milliseconds>(now);
    auto value = now_ms.time_since_epoch();
    auto millis = duration_cast<milliseconds>(value).count();
    auto tt = system_clock::to_time_t(now);
    auto tm = localtime(&tt);
    return to_string(tm->tm_hour) +":" + to_string(tm->tm_min) + ":" + to_string(tm->tm_sec) + "."+ to_string((millis % 1000));
}

void fun_family(int id){
    //exponential distribution generator
    default_random_engine generate;
    exponential_distribution<double> dist1(1.0 / a);
    exponential_distribution<double> dist2(1.0 / b);
    int wait=0;
    for (int i=0;i<n;i++){
        mtx.lock();
        file << getSysTime() <<": Family "<<id+1<<" becomess hungry"<<endl;
        mtx.unlock();
        auto start = high_resolution_clock::now();
        mtx2.lock();
        while(num_trays==0);
        num_trays--;//cout<<num_trays<<endl;
        mtx2.unlock();
        sem_wait(&trays);
        //finding end time
        auto stop = high_resolution_clock::now();
        //finding duration or time taken to compute pi
        auto duration = duration_cast<microseconds>(stop - start);
        wait+=(int)duration.count();
        mtx.lock();
        file << getSysTime() <<": Family "<<id+1<<" eats from the Pot"<<endl;
        mtx.unlock();
        this_thread::sleep_for(microseconds((int)(dist1(generate)*1000)));
        
        this_thread::sleep_for(microseconds((int)(dist2(generate)*1000)));

    }
    tot_wait[id]=wait/n;
    mtx.lock();
    file << getSysTime() <<": Family "<<id+1<<" has eaten "<<n<<" times. Hence, exits"<<endl;
    mtx.unlock();
}
void fun_cook(){
    //exponential distribution generator
    default_random_engine generate;
    exponential_distribution<double> dist1(1.0 / l);
    exponential_distribution<double> dist2(1.0 / u);
    while(finish==1){

        auto start = high_resolution_clock::now();
        while(num_trays>0 && finish==1);
        if(finish==0)return;
        //finding end time
        auto stop = high_resolution_clock::now();
        //finding duration or time taken to compute pi
        auto duration = duration_cast<microseconds>(stop - start);
        cook_wait+=(int)duration.count();
        //put m trays
        this_thread::sleep_for(microseconds((int)(dist1(generate)*1000)));
        for(int i=0;i<m;i++){
            sem_post(&trays);
        }
        //refill
        this_thread::sleep_for(microseconds((int)(dist1(generate)*1000)));
        c++;//cout<<c<<endl;
        num_trays=m;
        mtx.lock();
        file << getSysTime() <<": Vendor refills the ice cream "<< c <<" times"<<endl;
        mtx.unlock();
    }
    cout<<"exit"<<endl;
}
int main(){
    cin>>k>>m>>n>>a>>b>>l>>u;
    tot_wait= new int[k];
    sem_init(&trays, 0, m);
    num_trays=m;
    thread family[k];
    thread cook[1];
    file << getSysTime() <<": "<<k<<" threads created"<<endl;
    for (int i = 0; i < k; i++) {
        family[i] = thread(fun_family, i);
    }
    cook[0]=thread(fun_cook);
    // Join threads
    for (int i = 0; i < k; i++) {
        family[i].join();
    }
    
    finish=0;
    cook[0].join();
    file << getSysTime() <<": Last thread exits"<<endl;
    int avg=0;
    for(int i=0;i<k;i++){
        avg+=tot_wait[i];
    }
    avg=avg/k;
    cook_wait=cook_wait/c;
    cout<<avg<<endl<<cook_wait<<endl;
    
    file <<"Average wait time to eat = "<<avg<<" microseconds"<<endl;
    file <<"Average wait time to refill = "<<cook_wait<<" microseconds"<<endl;

   
    sem_destroy(&trays);
    return 0;
}