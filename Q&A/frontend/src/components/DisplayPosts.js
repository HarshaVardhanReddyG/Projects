import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";


function DisplayPosts(props)
{
const [cookies, setCookie, removeCookie] = useCookies(['token']);
const [params,setparams] = useState([]);
const [totpagenum,settotpagenum] = useState(1);
const [posts,setPosts] = useState([]);
const [curpagenum,setCurpagenum] = useState(1);

useEffect(()=>
{
    setPosts(props.posts);
    settotpagenum(props.pages)
    setparams(props.params)
},[])


function handleBack()
{
  if(curpagenum != 1)
  {
       if(params.searchOption == 'tag')
       {
           axios.get('http://localhost:5000/posts/tag/'+params.searchValue+'/'+(curpagenum-1),{}).
           then((res)=>
           {
                    setPosts(res.data.posts)
                    setCurpagenum(curpagenum-1);
           }).
           catch((err)=>
           {
               console.log(err);
           })
       }
       else if(params.searchOption == 'username')
       {
           axios.get('http://localhost:5000/posts/user/'+params.searchValue+'/'+(curpagenum-1),{}).
           then((res)=>
           {
                    setPosts(res.data.posts)
                    setCurpagenum(curpagenum-1);
           }).
           catch((err)=>
           {
               console.log(err);
           })
       }
       else if(params.searchOption == 'home2'){
        axios.post('http://localhost:5000/home2/'+(curpagenum-1),{},{
          headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${cookies.token}`
          }}).then((res)=>{

             setPosts(res.data.posts)
             setCurpagenum(curpagenum-1);
          }).catch((err)=>{
            console.log(err)
          })

       }
       else //multiple tags
       {
        axios.post('http://localhost:5000/posts/multiple_tags/'+(curpagenum-1),{tags:props.params.tags}).
        then((res)=>
        {
                 setPosts(res.data.posts)
                 setCurpagenum(curpagenum-1);
        }).
        catch((err)=>
        {
            console.log(err);
        })
       }
  }
}


function handleNext()
{
  if(curpagenum != totpagenum)
  {
    if(params.searchOption == 'tag')
       {
           axios.get('http://localhost:5000/posts/tag/'+params.searchValue+'/'+(curpagenum+1),{}).
           then((res)=>
           {
                setPosts(res.data.posts)
                setCurpagenum(curpagenum+1);
           }).
           catch((err)=>
           {
                console.log(err);
           })
       }
      else if(params.searchOption == 'username')
       {
           axios.get('http://localhost:5000/posts/user/'+params.searchValue+'/'+(curpagenum+1),{}).
           then((res)=>
           {
                setPosts(res.data.posts)
                setCurpagenum(curpagenum+1);
           }).
           catch((err)=>
           {
                console.log(err);
           })
       }
       else if(params.searchOption=='home2'){
        axios.post('http://localhost:5000/home2/'+(curpagenum+1),{},{
          headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${cookies.token}`
          }}).then((res)=>{

             setPosts(res.data.posts)
             setCurpagenum(curpagenum+1);
          }).catch((err)=>{
            console.log(err)
          })
       }
       else //multiple tags
       {
        axios.post('http://localhost:5000/posts/multiple_tags/'+(curpagenum+1),{tags:props.params.tags}).
        then((res)=>
        {
             setPosts(res.data.posts)
             setCurpagenum(curpagenum+1);
        }).
        catch((err)=>
        {
             console.log(err);
        })
       }
  }
}

function List({items}){
  var arr=items.tags.split(/[<\s>]+/);
  arr=arr.filter(function (el) {
    return el != "";
  })

  return(
    <div className="flex flex-row">
    {
      arr.map(
        (tag,index)=>{
           return(
           <div className="flex justify-between">
             <button key={index} className="bg-slate-200 hover:bg-sky-500 rounded px-4 py-2 truncate" onClick={(e)=>{props.handleTagClick(e)}}>{tag}
             </button>
            <p>&nbsp;&nbsp;</p> 
           </div>

           )
        }
      )
    }
    </div>
  )
}

  return (

        <div className="w-full overflow-y-auto rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            {/* Table header */}
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-4 py-3"><h2>Title</h2></th>
                <th className="px-4 py-3"><h2>Posted by</h2></th>
                <th className="px-4 py-3"><h2>Tags</h2></th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
  {/* Map through the data and create a row for each item */}
  {posts.map((post) => (
    <tr key={post.id} className="bg-white divide-y">
      <td className="px-4 py-3 border-b">
        <Link to={'/posts/' + post.id} className="hover:text-blue-500 truncate" state={{ post: post, Edit_status: params.Edit_status }}>
          {post.title}
        </Link>
      </td>
      <td className="px-4 py-3">{post.ownername}</td>
      <td className="px-4 py-3">
        <List items={post}></List>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
        <div className="flex justify-between w-full"> <button className="border w-24 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-red-600" onClick={handleBack}>back</button> Page {curpagenum} of {totpagenum} <button className="border w-24 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-red-600" onClick={handleNext}>next</button></div>
      </div>
    )
}

export default DisplayPosts;