import showdown from "showdown";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import Posts from "./Posts";
import Navbar from "./Navbar";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate ,useLocation} from "react-router-dom";
import { useCookies } from "react-cookie";


const Editpost = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const location = useLocation();
    const post = location.state.post;
    function List(tags) {
        var arr = tags.split(/[<\s>]+/);
        arr = arr.filter(function (el) {
            return el != "";
        })
        return arr
    }


    let converter = new showdown.Converter();
    let md_body = converter.makeMarkdown(post.body);


    const [body, setBody] = useState(md_body);
    const [title, settitle] = useState(post.title);
    const [multytag, setMultytag] = useState(List(post.tags));


    const [autocomp, setautocomp] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [tagload, settagload] = useState(0);
    const [tagarray, settagarray] = useState([]);
    const [matches, setmatches] = useState([]);
    const [yvalue, setyvalue] = useState(28);
    const navigate = useNavigate();
    // console.log(user)
    //const Ownername=user;

    function handleClick(e) {
        if (multytag.length == 5) {
            alert("A post cannot have more than five tags.");
        } else {
            let arr = multytag;
            if (!arr.includes(e.target.value)) {
                arr.push(e.target.value);
                let search_bar = document.getElementById("search-bar");
                search_bar.value = "";
                setSearchValue("");
                setMultytag([...arr]);
            } else {
                alert("This tag is already selected!");
            }
        }
    }

    function autocompleter() {
        setautocomp(0);
        if (searchValue == "") {
            return;
        }
        if (!tagload) {
            axios
                .get("http://localhost:5000/tags", {})
                .then((res) => {
                    settagload(1);
                    settagarray(res.data.tags);
                    let temp = tagarray.filter((tag) => {
                        const regex = new RegExp(`${searchValue}`, "gi");
                        return tag.tag_name.match(regex);
                    });
                    setmatches(temp);
                    setautocomp(1);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (tagload) {
            let temp = tagarray.filter((tag) => {
                const regex = new RegExp(`${searchValue}`, "gi");
                return tag.tag_name.match(regex);
            });
            setmatches(temp);
            setautocomp(1);
        }
    }

    useEffect(() => {
        setyvalue(80);
        autocompleter();
        if (searchValue == "") {
            setyvalue(32);
        }
    }, [searchValue]);




  //please change this function according to route in the backend
  //component written by abhinay
  //do not forget to change
    const handleSubmit = (e) => {
        e.preventDefault();
        if (multytag.length == 0) {
            alert("Atleast one tag must be selected")
            return;
        }
        let converter = new showdown.Converter();
        let html = converter.makeHtml(body);

       if(window.confirm('Are you sure that you want to update these changes in the post?')){
        axios
        .post("http://localhost:5000/edit_post", {
            title: title,
            body: html,
            tags: multytag,
            postid:post.id

        }, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${cookies.token}`,
            }
        })
        .then((res) => {
            if (res.data.tokenStatus == 1) {
                alert("Question edited succesful redirecting to homepage")
                setTimeout(() => {
                    navigate("/home2");
                }, 1000);
            }
            else {
                alert("You have to login to delete the post! redirecting to login page");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        })
        .catch((err) => {
            console.log(err);
        });
       }
       else{
        console.log('Do nothing')
       }
    };

    function removeTag(e) {
        e.preventDefault();

        let ind = e.target.getAttribute("ind");

        let arr = multytag;
        arr.splice(ind, 1);

        setMultytag([...arr]);
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col justify-center min-h-screen from-red-500 to-blue-500 bg-gradient-115 overflow-hidden">
                <div className="flex flex-col bg-white mx-20 rounded-md ">
                    <h1 className="text-3x1 text-center">Edit Post</h1>
                    <form className="mt-6 mx-5" onSubmit={handleSubmit}>
                        <label>Post title</label>
                        <input
                            className="block w-full px-4 py-2 mt-2 textblack bg-white border rounded-md focus:border-rose-400 focus:ring-rose-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            TYPE="text"
                            value={title}
                            onChange={(e) => settitle(e.target.value)}
                            required
                        ></input>
                        <label>Post body</label>
                        <MDEditor value={body} onChange={setBody} />
                        <div className="flex flex-row w-1/2 mt-2 overflow-hidden rounded-lg bg-gray-400 border shadow">
                            <input
                                id="search-bar"
                                className="text-base text-gray-400 flex-grow outline-none px-4 py-3"
                                type="text"
                                placeholder="Search Tag"
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}

                            />
                        </div>
                        <div className="mt-auto w-full overflow-hidden rounded-b-lg bg-white">
                            {!!autocomp && (
                                <div>
                                    <div class=" appearance-none w-full block bg-white border overflow-y-auto h-56  border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                        {matches.map((match) => (
                                            <option
                                                key={match.id}
                                                className="hover:text-blue-500 py-2"
                                                onClick={(e) => {
                                                    handleClick(e);
                                                }}
                                            >
                                                {match.tag_name}
                                            </option>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row">
                            {multytag.map((tag, index) => (
                                <div className="mx-4 bg-gray-400 rounded-lg mt-2" key={index}>
                                    &nbsp;{tag}
                                    <button className="text-red-500" onClick={removeTag}>
                                        <span
                                            class="m-1 inline-flex cursor-pointer items-center rounded-md bg-red-600 px-2 py-2 hover:bg-red-700"
                                            ind={index}
                                        >
                                            <svg
                                                width="12px"
                                                height="12px"
                                                viewBox="0 0 24 24"
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-labelledby="removeIconTitle"
                                                stroke="#000000"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                fill="none"
                                                color="#000000"
                                            >
                                                {" "}
                                                <title id="removeIconTitle">Remove</title>{" "}
                                                <path d="M17,12 L7,12" />{" "}
                                                <circle cx="12" cy="12" r="10" />{" "}
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Editpost;
