import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// import { ComplaintContext } from '../context/ComplaintContext';

function Complaint() {
  // const { fetchComplaints } = useContext(ComplaintContext);
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5001/auth/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategoryList(res.data);
      } catch (err) {
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };
  4;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !categories || !mobileNumber || !address || !description) {
      setError("All fields are required");
      return;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (mobileNumber && !mobilePattern.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("mobileNumber", mobileNumber);
    formData.append("address", address);
    formData.append("categories", categories);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/auth/complaints",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTitle("");
        setAddress("");
        setMobileNumber("");
        setCategories("");
        setDescription("");
        setImage(null);
        setPreview(null);
        toast.success("Your complaint has been submitted successfully.");
      } else {
        toast.error("Failed to submit complaint. Please try again later.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Error submitting complaint");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="container-fluid mt-5 p-2 border shadow-sm" style={{ maxWidth: '600px', margin: 'auto' }}>
    //   <div className="p-4 d-flex justify-content-between align-items-center">

    <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div className="col-sm-6">
          <h3>Complaint Form</h3>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Complaint-Form</li>
            </ol>
          </div>
        </div>
      </div>

      <div
        className="container-fluid p-2 border shadow-sm"
        style={{ maxWidth: "600px" }}
      >
        <div className="p-4 ">
          <h1 className="m-0 text-dark text-center">Complaint Form</h1>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-2">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="mobileNumber" className="form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              pattern="[0-9]{10}"
              title="Enter a 10-digit mobile number"
            />
          </div>


          <div className="mb-2">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              // pattern="[0-9]{10}"
              title="Enter your address"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="categories" className="form-label">
              Category
            </label>
            <select
              id="categories"
              className="form-control"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            >
              <option value="">Select a Category</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Describe your complaint"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="image" className="form-label">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          {preview && (
            <div className="mb-2">
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Complaint;




// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function Complaint() {
//   const { token } = useContext(AuthContext);

//   const [title, setTitle] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [categories, setCategories] = useState("");
//   const [categoryList, setCategoryList] = useState([]);
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);

//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:5001/auth/categories", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCategoryList(res.data);
//       } catch (err) {
//         setError("Failed to load categories");
//       }
//     };

//     fetchCategories();
//   }, [token]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     } else {
//       setPreview(null);
//     }
//   };



//   const handleGetLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLatitude(position.coords.latitude);
//           setLongitude(position.coords.longitude);
//           toast.success("Location fetched successfully!");
//         },
//         (error) => {
//           toast.error("Failed to get location. Please allow location access.");
//           console.error("Geolocation error:", error);
//         }
//       );
//     } else {
//       toast.error("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !categories || !mobileNumber || !address || !description) {
//       setError("All fields are required");
//       return;
//     }

//     const mobilePattern = /^[0-9]{10}$/;
//     if (mobileNumber && !mobilePattern.test(mobileNumber)) {
//       setError("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     setError(null);
//     setSuccessMessage(null);
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("mobileNumber", mobileNumber);
//     formData.append("address", address);
//     formData.append("categories", categories);
//     formData.append("description", description);
//     if (image) {
//       formData.append("image", image);
//     }
//     if (latitude && longitude) {
//       formData.append("latitude", latitude);
//       formData.append("longitude", longitude);
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5001/auth/complaints",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );


//       if (response.status === 200) {
//         setTitle("");
//         setAddress("");
//         setMobileNumber("");
//         setCategories("");
//         setDescription("");
//         setImage(null);
//         setPreview(null);
//         setLatitude(null);
//         setLongitude(null);
//         toast.success("Your complaint has been submitted successfully.");
//       } else {
//         toast.error("Failed to submit complaint. Please try again later.");
//       }
//     } catch (err) {
//       if (err.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else {
//         toast.error("Error submitting complaint");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div className="col-sm-6">
//           <h3>Complaint Form</h3>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">Complaint-Form</li>
//             </ol>
//           </div>
//         </div>
//       </div>

//       <div className="container-fluid p-2 border shadow-sm" style={{ maxWidth: "600px" }}>
//         <div className="p-4 ">
//           <h1 className="m-0 text-dark text-center">Complaint Form</h1>
//         </div>

//         {error && <div className="alert alert-danger">{error}</div>}
//         {successMessage && <div className="alert alert-success">{successMessage}</div>}

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <div className="mb-2">
//             <label htmlFor="title" className="form-label">
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               className="form-control"
//               placeholder="Enter Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>

//           <div className="mb-2">
//             <label htmlFor="mobileNumber" className="form-label">
//               Mobile Number
//             </label>
//             <input
//               type="tel"
//               className="form-control"
//               id="mobileNumber"
//               value={mobileNumber}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               pattern="[0-9]{10}"
//               title="Enter a 10-digit mobile number"
//             />
//           </div>

//           <div className="mb-2">
//             <label htmlFor="address" className="form-label">
//               Address
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               required
//               title="Enter your address"
//             />
//           </div>

//           <div className="mb-2">
//             <label htmlFor="categories" className="form-label">
//               Category
//             </label>
//             <select
//               id="categories"
//               className="form-control"
//               value={categories}
//               onChange={(e) => setCategories(e.target.value)}
//             >
//               <option value="">Select a Category</option>
//               {categoryList.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.category_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-2">
//             <label htmlFor="description" className="form-label">
//               Description
//             </label>
//             <textarea
//               id="description"
//               className="form-control"
//               placeholder="Describe your complaint"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={4}
//             />
//           </div>

//           <div className="mb-2">
//             <label htmlFor="image" className="form-label">
//               Upload Image
//             </label>
//             <input
//               type="file"
//               id="image"
//               className="form-control"
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//           </div>

//           {preview && (
//             <div className="mb-2">
//               <img
//                 src={preview}
//                 alt="Preview"
//                 style={{
//                   maxWidth: "200px",
//                   maxHeight: "200px",
//                   objectFit: "contain",
//                 }}
//               />
//             </div>
//           )}

//           <div className="mb-2">
//             <button type="button" className="btn btn-secondary" onClick={handleGetLocation}>
//               Get Location
//             </button>
//             {latitude && longitude && (
//               <p className="mt-2">
//                 Your location: <br />
//                 Latitude: {latitude.toFixed(5)}, Longitude: {longitude.toFixed(5)}
//               </p>
//             )}
//           </div>

//           <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//             {loading ? "Submitting..." : "Submit Complaint"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Complaint;
