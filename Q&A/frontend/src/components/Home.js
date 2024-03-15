import React from 'react';
import Navbar from './Navbar';

const Home = () => {
  return (
    <div><Navbar/>
    <div className="relative flex flex-col min-h-screen bg-no-repeat bg-cover justify-center bg-scroll" style={{backgroundImage: `url("https://lh3.googleusercontent.com/p/AF1QipN6SzIG0VC1OiXHjiV2Ru9ZCJMCd0YT1iPJ-pU=s680-w680-h510")`}}>
    <div className="flex flex-col justify-center items-center rounded-lg mx-36">
              <h1 className="text-black text-3xl text-center mt-4 mb-12">Welcome</h1>
      <main className="p-12 flex flex-col bg-white">
        <section id="about" className="py-10 mx-10">
          <h2 className="text-3xl font-bold text-indigo-500 text-center">About us</h2>
          <p className="text-gray-700">This is a Community Question Answer (CQA) website developed for the DBMS assignment. A CQA website is an online platform where users can ask questions on various topics and get answers from other members of the community. This website includes features such as tags, the ability to create, edit, or delete posts, search posts by tags or usernames, sorting by time, and upvoting, downvoting</p>
        </section>
        <section id="contact" className="py-12 ">
  <h2 className="text-3xl font-bold text-indigo-500 text-center mb-8">Contact Us</h2>
  <div className='flex flex-col max-w-xl mx-auto'>
    <div className="mb-4">You can contact us at IITH or email us at:</div>
    <div className="mb-2">
      <span className="font-medium">cs21btech11014@iith.ac.in</span> (Chittepu Rutheesh Reddy)
    </div>
    <div className="mb-2">
      <span className="font-medium">cs21btech11055@iith.ac.in</span> (Sadineni Abhinay)
    </div>
    <div className="mb-2">
      <span className="font-medium">cs21btech11017@iith.ac.in</span> (G Harsha Vardhan Reddy)
    </div>
    <div className="mb-2">
      <span className="font-medium">cs21btech11030@iith.ac.in</span> (Kotikalapudi Karthik)
    </div>
  </div>
</section>

      </main>
    </div>
    </div>
    </div>
  );
};

export default Home ;