

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import toast from "react-hot-toast";

// function Complaint() {
//   const { token, user } = useContext(AuthContext);

//   const [mobile, setMobileNumber] = useState(user?.mobile || "");
//   const [address, setAddress] = useState("");
//   const [categories, setCategories] = useState(""); // category id or "other"
//   const [otherCategory, setOtherCategory] = useState(""); // for custom complaint
//   const [categoryList, setCategoryList] = useState([]);
//   const [description, setDescription] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // useEffect(() => {
//   //   const fetchCategories = async () => {
//   //     try {
//   //       const res = await axios.get(`http://localhost:5001/auth/${user.role}-categories`, {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       setCategoryList(res.data);
//   //     } catch (err) {
//   //       setError("Failed to load categories");
//   //     }
//   //   };

//   //   fetchCategories();
//   // }, [token]);\
  
// useEffect(() => {
//   const fetchCategories = async () => {
//     try {
//       let endpoint = "";

//       if (user?.role === "Water" || user?.role === "CCMS") {
//         endpoint = `http://localhost:5001/auth/${user.role}-categories`;
//       } else {
//         // Endpoint for general/non-role categories
//         endpoint = "http://localhost:5001/auth/categories";
//       }

//       const res = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setCategoryList(res.data);
//     } catch (err) {
//       console.error("Category fetch error:", err);
//       setError("Failed to load complaint categories.");
//     }
//   };

//   if (user?.role) fetchCategories();
// }, [token, user?.role]);

  
  

//   const isValidCoordinate = (value) => /^-?\d+(\.\d+)?$/.test(value);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(file ? URL.createObjectURL(file) : null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!categories || !mobile || !address || !description || !latitude || !longitude) {
//       setError("All fields including latitude and longitude are required");
//       return;
//     }

//     if (categories === "other" && !otherCategory.trim()) {
//       setError("Please specify your complaint type");
//       return;
//     }

//     const mobilePattern = /^[0-9]{10}$/;
//     if (!mobilePattern.test(mobile)) {
//       setError("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
//       setError("Latitude and Longitude must be valid numbers (e.g. 28.7041, 77.1025)");
//       return;
//     }

//     setError(null);
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("mobile", mobile);
//       formData.append("address", address);

//       // if (categories === "other") {
//       //   formData.append("other_complaint_category", otherCategory.trim());
//       // } else {
//       //   formData.append("categories", categories);
//       // }

//       if (categories === "other") {
//   formData.append("categories", ""); // Send empty value
//   formData.append("other_complaint_category", otherCategory.trim());
// } else {
//   formData.append("categories", categories); // Send numeric ID
//   formData.append("other_complaint_category", ""); // Empty string
// }



// //       formData.append("categories", categories === "other" ? "" : categories);
// // formData.append("other_complaint_category", categories === "other" ? otherCategory.trim() : "");


//       formData.append("description", description);
//       formData.append("latitude", parseFloat(latitude));
//       formData.append("longitude", parseFloat(longitude));
//       if (image) formData.append("image", image);

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
//         setAddress("");
//         setMobileNumber(user?.mobile || "");
//         setCategories("");
//         setOtherCategory("");
//         setDescription("");
//         setLatitude("");
//         setLongitude("");
//         setImage(null);
//         setPreview(null);
//         toast.success("Your complaint has been submitted successfully.");
//       } else {
//         toast.error("Failed to submit complaint. Please try again later.");
//       }
//     } catch (err) {
//       toast.error(err.message || "Error submitting complaint");
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
//               <li className="breadcrumb-item"><a href="/">Home</a></li>
//               <li className="breadcrumb-item active">Complaint-Form</li>
//             </ol>
//           </div>
//         </div>
//       </div>

//       <div className="container-fluid p-2 border shadow-sm" style={{ maxWidth: "600px" }}>
//         <div className="p-4">
//           <h1 className="text-center">Complaint Form</h1>
//         </div>

//         {error && <div className="alert alert-danger">{error}</div>}

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <div className="mb-2">
//             <label className="form-label">Mobile Number</label>
//             <input
//               type="tel"
//               className="form-control"
//               value={mobile}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               pattern="[0-9]{10}"
//               title="Enter a 10-digit mobile number"
//             />
//           </div>

//           <div className="mb-2">
//             <label className="form-label">Address</label>
//             <input
//               type="text"
//               className="form-control"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </div>

//           <div className="mb-2">
//             <label className="form-label">Complaint Type</label>
//             <select
//               className="form-control"
//               value={categories}
//               onChange={(e) => setCategories(e.target.value)}
//             >
//               <option value="">Select Complaint Type</option>
//               {categoryList.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.category_name}
//                 </option>
//               ))}
//               <option value="other">Other</option>
//             </select>
//           </div>

//           {categories === "other" && (
//             <div className="mb-2">
//               <label className="form-label">Specify Other Complaint Type</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter complaint type"
//                 value={otherCategory}
//                 onChange={(e) => setOtherCategory(e.target.value)}
//                 maxLength={100}
//                 required
//               />
//             </div>
//           )}

//           <div className="mb-2">
//             <label className="form-label">Description</label>
//             <textarea
//               className="form-control"
//               placeholder="Describe your complaint"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={4}
//             />
//           </div>

//           <div className="mb-2">
//             <label className="form-label">Latitude</label>
//             <input
//               type="text"
//               className="form-control"
//               value={latitude}
//               onChange={(e) => setLatitude(e.target.value)}
//               placeholder="e.g. 28.7041"
//             />
//           </div>

//           <div className="mb-2">
//             <label className="form-label">Longitude</label>
//             <input
//               type="text"
//               className="form-control"
//               value={longitude}
//               onChange={(e) => setLongitude(e.target.value)}
//               placeholder="e.g. 77.1025"
//             />
//           </div>

//           {latitude && longitude && isValidCoordinate(latitude) && isValidCoordinate(longitude) && (
//             <div className="mb-2">
//               <a
//                 href={`https://www.google.com/maps?q=${latitude},${longitude}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 View location on Google Maps
//               </a>
//             </div>
//           )}

//           <div className="mb-2">
//             <label className="form-label">Upload Image</label>
//             <input
//               type="file"
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
//                 style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
//               />
//             </div>
//           )}

//           <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//             {loading ? "Submitting..." : "Submit Complaint"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Complaint;



import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function Complaint() {
  const { token, user } = useContext(AuthContext);

  const [mobile, setMobileNumber] = useState(user?.mobile || "");
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState(""); // category id or "other"
  const [subcategories, setSubcategories] = useState([]); // Subcategory list
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Selected subcategory id
  const [otherCategory, setOtherCategory] = useState(""); // for custom complaint
  const [categoryList, setCategoryList] = useState([]);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories based on user role
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let endpoint = "";

        if (user?.role === "Water" || user?.role === "CCMS") {
          // endpoint = `http://localhost:5001/auth/${user.role}-categories`;
      
          endpoint = "http://localhost:5001/auth/categories";
        }

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategoryList(res.data);
      } catch (err) {
        console.error("Category fetch error:", err);
        setError("Failed to load complaint categories.");
      }
    };

    if (user?.role) fetchCategories();
  }, [token, user?.role]);

  // Fetch subcategories when a category that requires it is selected
  useEffect(() => {
    if (!categories) {
      setSubcategories([]);
      setSelectedSubcategory("");
      return;
    }

    // Find the selected category object to check its name
    const selectedCategoryObj = categoryList.find(
      (c) => c.id.toString() === categories.toString()
    );

    if (
      selectedCategoryObj &&
      selectedCategoryObj.category_name.toLowerCase() === "ccms"
    ) {
      // Fetch subcategories for the selected category
      axios
        .get(`http://localhost:5001/auth/categories/${categories}/subcategories`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setSubcategories(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch subcategories", err);
          setSubcategories([]);
        });
    } else {
      // Clear subcategories and selection if category doesn't require subcategories
      setSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [categories, categoryList, token]);

  const isValidCoordinate = (value) => /^-?\d+(\.\d+)?$/.test(value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !categories ||
      !mobile ||
      !address ||
      !description ||
      !latitude ||
      !longitude
    ) {
      setError("All fields including latitude and longitude are required");
      return;
    }

    if (categories === "other" && !otherCategory.trim()) {
      setError("Please specify your complaint type");
      return;
    }

    if (subcategories.length > 0 && !selectedSubcategory) {
      setError("Please select a subcategory");
      return;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
      setError(
        "Latitude and Longitude must be valid numbers (e.g. 28.7041, 77.1025)"
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("mobile", mobile);
      formData.append("address", address);

      if (categories === "other") {
        formData.append("categories", "");
        formData.append("other_complaint_category", otherCategory.trim());
      } else {
        formData.append("categories", categories);
        formData.append("other_complaint_category", "");
      }

      if (selectedSubcategory) {
        formData.append("subcategory", selectedSubcategory);
      }

      formData.append("description", description);
      formData.append("latitude", parseFloat(latitude));
      formData.append("longitude", parseFloat(longitude));
      if (image) formData.append("image", image);

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
        setAddress("");
        setMobileNumber(user?.mobile || "");
        setCategories("");
        setSelectedSubcategory("");
        setOtherCategory("");
        setDescription("");
        setLatitude("");
        setLongitude("");
        setImage(null);
        setPreview(null);
        toast.success("Your complaint has been submitted successfully.");
      } else {
        toast.error("Failed to submit complaint. Please try again later.");
      }
    } catch (err) {
      toast.error(err.message || "Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid border shadow-sm"
      style={{ marginTop: "100px", width: "98%" }}
    >
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
        <div className="p-4">
          <h1 className="text-center">Complaint Form</h1>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-2">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobileNumber(e.target.value)}
              pattern="[0-9]{10}"
              title="Enter a 10-digit mobile number"
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Complaint Type</label>
            <select
              className="form-control"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            >
              <option value="">Select Complaint Type</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>

          {/* Show subcategory dropdown if subcategories exist */}
          {subcategories.length > 0 && (
            <div className="mb-2">
              <label className="form-label">Subcategory</label>
              <select
                className="form-control"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subcategory_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {categories === "other" && (
            <div className="mb-2">
              <label className="form-label">Specify Other Complaint Type</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter complaint type"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                maxLength={100}
                required
              />
            </div>
          )}

          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Describe your complaint"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Latitude</label>
            <input
              type="text"
              className="form-control"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 28.7041"
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Longitude</label>
            <input
              type="text"
              className="form-control"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 77.1025"
            />
          </div>

          {latitude && longitude && isValidCoordinate(latitude) && isValidCoordinate(longitude) && (
            <div className="mb-2">
              <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View location on Google Maps
              </a>
            </div>
          )}

          <div className="mb-2">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
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
                style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Complaint;
