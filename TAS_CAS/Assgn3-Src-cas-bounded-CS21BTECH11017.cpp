#include <bits/stdc++.h>
using namespace std;
using namespace std::chrono;
//Global variables
int n,k,l1,l2;
void testCS(int i);
atomic<bool> flag(false);
atomic<bool> *waiting;
mutex mtx;
vector <string> v;
vector<string>* arr;
//Lock to prevent multiple files going to cs
void Lock(int id){
    waiting[id]=true;bool expected =false;
    bool key =1;
    while (waiting[id]==true && !flag.compare_exchange_strong(expected, true)) {
        expected = false;
    }
    waiting[id]=false;
}

//allowing another funcn to enter cs by updating waiting[i] or flag
void Unlock(int id) {
    int j=(id+1)%n;
    while ((j != id) && !waiting[j]) j = (j + 1) % n;
    if (j == id) flag.store(false);
    else waiting[j]=false;
}
//getting system time
string getSysTime(){
    auto now = system_clock::now();
    auto now_ms = time_point_cast<milliseconds>(now);
    auto value = now_ms.time_since_epoch();
    auto millis = duration_cast<milliseconds>(value).count();
    auto tt = system_clock::to_time_t(now);
    auto tm = localtime(&tt);
    return to_string(tm->tm_hour) +":" + to_string(tm->tm_min) + ":" + to_string(tm->tm_sec) + "."+ to_string((millis % 1000));
}

//main thread
int main(){
    cin>>n>>k>>l1>>l2;
    arr=new vector<string>[n];
      // Create n threads
    thread threads[n];
    waiting=new atomic<bool>[n];
    for (int i = 0; i < n; i++) {
        threads[i] = thread(testCS, i);
    }
    // Join threads
    for (int i = 0; i < n; i++) {
        threads[i].join();
    }
    //writing to a file
    ofstream file("bounded_cas-me-output.txt");
    for(int j=0;j<3*k;j+=3){
        for(int i=0;i<n;i++){
            file<<arr[i][j];
            file<<arr[i][j+1];
            file<<arr[i][j+2];
        }
    }
}

//this code is being executed by each thread
void testCS(int id){
    vector<string> vi;
    //generating distribution
    default_random_engine generate;
    exponential_distribution<double> dist1(1.0 / l1);
    exponential_distribution<double> dist2(1.0 / l2);

    for(int i=0;i<k;i++){
        string s,s3,s2;
        if(i==0) s=to_string(i+1) + "st CS Request at "+getSysTime()+" by thread "+to_string(id+1)+"\n";
        else if(i==1) s=to_string(i+1) + "nd CS Request at "+getSysTime()+" by thread "+to_string(id+1)+"\n";
        else if(i==2) s=to_string(i+1) + "rd CS Request at "+getSysTime()+" by thread "+to_string(id+1)+"\n";
        else s=to_string(i+1) + "th CS Request at "+getSysTime()+" by thread "+to_string(id+1)+"\n";
        vi.push_back(s);

        Lock(id); // Entry Section
        if(i==0) s2=to_string(i+1)+"st CS Enter at "+getSysTime()+" by thread "+to_string(id+1)+"\n";
        else if(i==1) s2=to_string(i+1)+"nd CS Enter at "+getSysTime()+" by thread "+to_string(id+1)+"\n";
        else if(i==2) s2=to_string(i+1)+"rd CS Enter at "+getSysTime()+" by thread "+to_string(id+1)+"\n";
        else s2=to_string(i+1)+"th CS Enter at "+getSysTime()+" by thread "+to_string(id+1)+"\n";

        vi.push_back(s2);
        this_thread::sleep_for(microseconds((int)(dist1(generate)*1000))); // Simulation of critical-section
        Unlock(id); // Exit Section
        if(i==0) s3=to_string(i+1) + "st CS Exit at " +getSysTime()+" by thread "+to_string(id+1)+"\n";
        else if(i==1) s3=to_string(i+1) + "nd CS Exit at " +getSysTime()+" by thread "+to_string(id+1)+"\n";
        else if(i==2) s3=to_string(i+1) + "rd CS Exit at " +getSysTime()+" by thread "+to_string(id+1)+"\n";
        else s3=to_string(i+1) + "th CS Exit at " +getSysTime()+" by thread "+to_string(id+1)+"\n";
        vi.push_back(s3);
        this_thread::sleep_for(microseconds((int)(dist2(generate)*1000)));
    }
    //entering strings to be printed to arr[id]
    arr[id]=vi;
}