import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axios";
import Loading from "./Loading";

function ImageForm({ handleNext, handlePrevious }) {

    const [fetchedImages, setFetchedImages] = useState([{ id: 10, imgURL: "http://localhost:5000/hotel1.jpg" }, { id: 20, imgURL: "http://localhost:5000/hotel2.jpg" }, { id: 30, imgURL: "http://localhost:5000/hotel3.jpg" }, { id: 45, imgURL: "http://localhost:5000/hotel4.jpg" }, { id: 59, imgURL: "http://localhost:5000/hotel5.jpg" }])

    const [formData1, setFormData1] = useState({
        images: []
    })
    const [imagePopup, setImagePopup] = useState(false);
    const [uploadedimagePopup, setUploadedImagePopup] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentUploadedImageIndex, setCurrentUploadedImageIndex] = useState(0);


    const toggleImagePopup = (index) => {
        setImagePopup(!imagePopup);
        setCurrentImageIndex(index);
    };

    const [loading, setLoading] = useState(true)



    const toggleUploadedImagePopup = (index) => {
        setUploadedImagePopup(!uploadedimagePopup);
        setCurrentUploadedImageIndex(index);
    };





    const showNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % fetchedImages.length;
        setCurrentImageIndex(nextIndex);
    };

    const showNextUploadedImage = () => {
        const nextIndex = (currentUploadedImageIndex + 1) % formData1.images.length;
        setCurrentUploadedImageIndex(nextIndex)

    }

    const showPreviousImage = () => {
        const previousIndex = (currentImageIndex - 1 + fetchedImages.length) % fetchedImages.length;
        setCurrentImageIndex(previousIndex);
    };

    const showPreviousUploadedImage = () => {
        const previousIndex = (currentUploadedImageIndex - 1 + formData1.images.length) % formData1.images.length;
        setCurrentUploadedImageIndex(previousIndex)
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (formData1.images.length + files.length > 5) {
            alert("You can only upload up to 5 images.");
            return;
        }
        setFormData1({
            ...formData1,
            images: [...formData1.images, ...files.slice(0, 5 - formData1.images.length)]
        });
    };


    const handleImageDelete = async (id) => {

        const index = fetchedImages.findIndex(image => image.id === id);
        if (index != -1) {

            try {
                axiosInstance.delete(`delete_images/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    if (response.status === 200) {
                        const updatedImages = [...fetchedImages];
                        updatedImages.splice(index, 1);
                        setFetchedImages(updatedImages);
                        console.log("Image deleted successfully");
                        if(response.status === 200){
                            alert("Images Deleted Successfully")
                        }   
                    } else {
                        console.error("Failed to delete image");
                    }
                })
                    .catch(error => {
                        console.error("Error deleting image:", error);
                    });
            }
            catch (error) {
                console.error(error)
            }

            const updatedImages = [...fetchedImages];
            updatedImages.splice(index, 1);
            setFetchedImages(updatedImages)
        }

    };

    const handleUpoadedImageDelete = (index) => {
        const updatedImages = [...formData1.images];
        updatedImages.splice(index, 1);
        setFormData1({
            ...formData1,
            images: updatedImages
        });

    }

    const handleFetch = async () => {
        setLoading(true); // Set loading to true when the effect starts

        axiosInstance.get('get_images', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.data) {
                    const transformedImages = response.data.images.map(image => {
                        return {
                            id: image.image_id,
                            imgURL: `http://localhost:5000/${image.image}` // Replace path_to_your_server with your server's URL
                        };
                    });
                    setFetchedImages(transformedImages);
                }
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
            })
            .finally(() => {
                setLoading(false);
            });


    }

    useEffect(() => {
       handleFetch();

    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData1)

        const formData = new FormData();
        Object.values(formData1.images).forEach(file => {
            formData.append("images", file);

            console.log(formData['images'])
        });

        try {
            const response = await axiosInstance.post('add_images', formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }, formData1);
            if(response.status === 200){
                alert("Images uploaded Successfully")
            } 
            // Navigate("/manager-hotel/2")  
            handleFetch() 
            setFormData1({
                ...formData1,
                images: []
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }

    };



    return (
        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
            {loading ? (
                // Display loading indicator while waiting for data
                <Loading />
            ) : (
            <form className="space-y-4">
                <div>
                    <p>Upload Images:</p>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="border border-gray-300 rounded-md px-4 py-2" />
                    {/* Display submitted images */}
                    {fetchedImages.length > 0 && (
                        <div>
                            <p>Images Present:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {fetchedImages.map((image, index) => (
                                    <div key={image.id} className="relative">
                                        <img src={image.imgURL} alt={`Image ${image.id}`} className="w-20 h-20 object-cover rounded-md" onClick={() => toggleImagePopup(index)} />
                                        {/* Minus button for deleting image */}
                                        <button onClick={() => handleImageDelete(image.id)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full">
                                            -
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {imagePopup && (
                                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white p-8 rounded-lg overflow-y-auto max-h-full relative" style={{ width: '80%' }}>
                                        <button onClick={() => setImagePopup(false)} className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800">
                                            &#x2715;
                                        </button>
                                        <button onClick={showPreviousImage} className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-md">
                                            &lt;
                                        </button>
                                        <button onClick={showNextImage} className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md">
                                            &gt;
                                        </button>
                                        <img src={fetchedImages[currentImageIndex].imgURL} alt={`Image ${currentImageIndex}`} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {formData1.images.length > 0 && (
                        <div>
                            <p>Uploaded Images:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData1.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img src={URL.createObjectURL(image)} alt={`Image ${index}`} className="w-20 h-20 object-cover rounded-md" onClick={() => toggleUploadedImagePopup(index)} />
                                        <button onClick={() => handleUpoadedImageDelete(index)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full">
                                            -
                                        </button>
                                    </div>
                                ))}


                            </div>
                            {uploadedimagePopup && (
                                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white p-8 rounded-lg overflow-y-auto max-h-full relative" style={{ width: '80%' }}>
                                        <button onClick={() => setUploadedImagePopup(false)} className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800">
                                            &#x2715;
                                        </button>
                                        <button onClick={showPreviousUploadedImage} className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-md">
                                            &lt;
                                        </button>
                                        <button onClick={showNextUploadedImage} className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md">
                                            &gt;
                                        </button>
                                        <img src={URL.createObjectURL(formData1.images[currentUploadedImageIndex])} alt={`Image ${currentImageIndex}`} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
                <button onClick={(e) => handlePrevious(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">Previous</button>
                <button onClick={(e) => handleNext(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Next</button>
                <button onClick={(e) => handleSubmit(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
            </form>
            )}
        </div>
    )

}

export default ImageForm;
