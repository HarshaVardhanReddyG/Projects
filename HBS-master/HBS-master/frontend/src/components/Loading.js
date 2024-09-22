const Loading = () => {
    return ( 
        <div className="flex justify-center items-center w-screen h-screen">
            <div className="inline-block w-24 h-24 
            border-8 
            border-t-amber-500 
            border-r-blue-500 
            border-b-rose-500 
            border-l-green-500 
            rounded-full 
            animate-spin" role="status"></div>
           
            <span className="visually-hidden">     Loading...</span>
        </div>
     );
}
 
export default Loading;