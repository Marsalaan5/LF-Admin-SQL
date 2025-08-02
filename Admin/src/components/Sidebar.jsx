// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Sidebar({ isOpen, userRole }) {
//   const [menuItems, setMenuItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openItems, setOpenItems] = useState({});


//   useEffect(() => {
//     fetchMenuItems();
//   }, [userRole]);

//   const fetchMenuItems = async () => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         `http://localhost:5001/auth/menu?role=${userRole}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
            
//       setMenuItems(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       setError("Failed to load menu items", error);
//       setIsLoading(false);
//     }
//   };

//   // const renderMenu = (items) =>
//   //   items.map((item) => (
//   //     <li key={item.id} className="nav-item mb-2">
//   //       <Link
//   //         to={item.status === "active" ? item.path : "#"}
//   //         className={`nav-link d-flex align-items-center ${
//   //           item.status === "active" ? "text-white" : "text-secondary"
//   //         }`}
//   //       >
//   //         <i className={`${item.icon} me-2`}></i>
//   //         <span>{item.title}</span>
//   //       </Link>
//   //       {item.children && item.children.length > 0 && (
//   //         <ul className="nav flex-column ms-3">{renderMenu(item.children)}</ul>
//   //       )}
//   //     </li>
//   //   ));

//     const toggleItem = (id) => {
//   setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
// };

// const renderMenu = (items) =>
//   items.map((item) => (
//     <li key={item.id} className="nav-item mb-2">
//       <div
//         className={`nav-link d-flex align-items-center justify-content-between ${
//           item.status === "active" ? "text-white" : "text-secondary"
//         }`}
//         onClick={() => item.children?.length > 0 && toggleItem(item.id)}
//         style={{ cursor: item.children?.length > 0 ? "pointer" : "default" }}
//       >
//         <Link
//           to={item.status === "active" ? item.path : "#"}
//           className="d-flex align-items-center"
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <i className={`${item.icon} me-2`}></i>
//           <span>{item.title}</span>
//         </Link>
//         {item.children?.length > 0 && (
//           <i
//             className={`fas ${
//               openItems[item.id] ? "fa-chevron-down" : "fa-chevron-right"
//             }`}
//           ></i>
//         )}
//       </div>

//       {item.children && item.children.length > 0 && openItems[item.id] && (
//         <ul className="nav flex-column ms-3">
//           {renderMenu(item.children)}
//         </ul>
//       )}
//     </li>
//   ));



//   return (
//     <div
//       className={`sidebar-container ${isOpen ? "open" : ""}`}
//       style={{
//         height: "100vh",
//         // background: "linear-gradient(to right, #ff7e5f, #ff7e5f)",
//         background: "linear-gradient(135deg, #4b6cb7, #182848)",

//         padding: "20px",
//         color: "white",
//         overflowY: "auto",
//         transition: "left 0.3s ease-in-out",
//       }}
//     >
//       <div className="p-2 mt-2">
//         {isLoading ? (
//           <p>Loading menu...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : (
//           <ul className="nav flex-column">{renderMenu(menuItems)}</ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Sidebar({ isOpen, userRole,isMobile }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openItems, setOpenItems] = useState({});
  const [hoveredItemId, setHoveredItemId] = useState(null);


  useEffect(() => {
    fetchMenuItems();
  }, [userRole]);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5001/auth/menu?role=${userRole}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMenuItems(response.data);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to load menu items",error);
      setIsLoading(false);
    }
  };

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };




const renderMenu = (items) =>
  items.map((item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isHovered = hoveredItemId === item.id;

    return (
      <li
        key={item.id}
        className="nav-item mb-2"
        style={{ listStyle: "none", position: "relative" }}
        onMouseEnter={() => !isOpen && hasChildren && !isMobile && setHoveredItemId(item.id)}
        onMouseLeave={() => !isOpen && hasChildren && !isMobile && setHoveredItemId(null)}
        onClick={() => {
          if (!isOpen && hasChildren && isMobile) {
            toggleItem(item.id);
          }
        }}
      >
        {/* Main Item */}
        {/* <div
          className={`nav-link d-flex align-items-center justify-content-between ${
            item.status === "active" ? "text-white" : "text-secondary"
          }`}
          onClick={() => isOpen && hasChildren && toggleItem(item.id)}
          style={{
            cursor: hasChildren ? "pointer" : "default",
            padding: "8px 10px",
            textDecoration: "none",
            color: "inherit",
          }}
        > */}

        <div
  className="nav-link d-flex align-items-center justify-content-between"
  onClick={() => isOpen && hasChildren && toggleItem(item.id)}
  style={{
    cursor: hasChildren ? "pointer" : "default",
    padding: "8px 10px",
    textDecoration: "none",
    color: "inherit",
    backgroundColor: hoveredItemId === item.id ? "rgba(255,255,255,0.15)" : "transparent",
    borderRadius: hoveredItemId === item.id ? "4px" : "0px",
    transition: "all 0.2s ease-in-out",
  }}
>

          <Link
            to={item.status === "active" ? item.path : "#"}
            className="d-flex align-items-center"
            style={{ textDecoration: "none", color: "inherit", width: "100%", }}
          >
            <i className={`${item.icon} me-2`} title={!isOpen ? item.title : ""}></i>
            {isOpen && <span>{item.title}</span>}
          </Link>

          {hasChildren && isOpen && (
            <i
              className={`fas ${
                openItems[item.id] ? "fa-chevron-down" : "fa-chevron-right"
              }`}
            ></i>
          )}
        </div>

        {/* Submenu — Inline for expanded sidebar */}
        {hasChildren && isOpen && openItems[item.id] && (
          <ul className="nav flex-column ms-3 mt-1">
            {renderMenu(item.children)}
          </ul>
        )}

      
{hasChildren && !isOpen && !isMobile && isHovered && (
  <div
    onMouseEnter={() => setHoveredItemId(item.id)}
    onMouseLeave={() => setHoveredItemId(null)}
    style={{
      position: "fixed",    
      top: "20px",
      fontSize:"20px",
      fontFamily:"auto",
      
      left: 70,          
      height: "100vh",
      width: 250,
      paddingTop: 60,    
      backgroundColor: "rgba(11, 108, 179, 0.95)",
      pointerEvents: "auto",
      overflowY: "auto",
      boxShadow: "none",
      display: "flex",
      flexDirection: "column",
      zIndex: 10002,
    }}
  >
    {item.children.map((child) => (
      <Link
        key={child.id}
        to={child.path}
        style={{
          display: "flex",
          alignItems: "center",
          color: "white",
          padding: "10px 15px",
          textDecoration: "none",
          width: "100%",
          boxSizing: "border-box",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <i className={`${child.icon} me-2`}></i>
        {child.title}
      </Link>
    ))}
  </div>
)}



        {/* Submenu — Collapsed + mobile (toggleable) */}
        {hasChildren && !isOpen && isMobile && openItems[item.id] && (
          <ul className="nav flex-column ms-3 mt-1">
            {item.children.map((child) => (
              <li key={child.id}>
                <Link
                  to={child.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    padding: "6px 10px",
                    textDecoration: "none",
                   
                  }}
                  
                >
                  <i className={`${child.icon} me-2`}></i>
                  <span>{child.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  });



    return (
    
    <div
  className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}
  style={{
    width: isOpen ? "250px" : "70px",
    height: "100vh",
    background: "linear-gradient(135deg, #4b6cb7, #182848)",
    padding: "20px 10px",
    color: "white",
    overflow:"visible",
    
    transition: "width 0.3s ease-in-out",
    position: "relative", 
    zIndex: 10000,
    
  }}
>

      {/* Logo */}
      {/* <div className="text-center mb-4">
        <i className="fas fa-rocket fa-2x"></i>
        {isOpen && <div className="mt-2 fw-bold">MyApp</div>}
      </div> */}

      {/* Menu */}
      <div className="p-2 mt-2">
        {isLoading ? (
          <p>Loading menu...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="nav flex-column">{renderMenu(menuItems)}</ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Sidebar({ isOpen, userRole, isMobile }) {
//   const [menuItems, setMenuItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openItems, setOpenItems] = useState({});
//   const [hoveredItemId, setHoveredItemId] = useState(null);

//   useEffect(() => {
//     fetchMenuItems();
//   }, [userRole]);

//   const fetchMenuItems = async () => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         `http://localhost:5001/auth/menu?role=${userRole}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMenuItems(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       setError("Failed to load menu items");
//       setIsLoading(false);
//     }
//   };

//   const toggleItem = (id) => {
//     setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const renderMenu = (items) =>
//     items.map((item) => {
//       const hasChildren = item.children && item.children.length > 0;
//       const isHovered = hoveredItemId === item.id;

//       return (
//         <li
//           key={item.id}
//           className="nav-item mb-2"
//           style={{ listStyle: "none", position: "relative" }}
//           onMouseEnter={() => setHoveredItemId(item.id)}
//           onMouseLeave={() => setHoveredItemId(null)}
//           onClick={() => {
//             if (!isOpen && hasChildren && isMobile) {
//               toggleItem(item.id);
//             }
//           }}
//         >
//           {/* Main Item */}
//           <div
//             className="nav-link d-flex align-items-center justify-content-between"
//             onClick={() => isOpen && hasChildren && toggleItem(item.id)}
//             style={{
//               cursor: hasChildren ? "pointer" : "default",
//               padding: "8px 10px",
//               textDecoration: "none",
//               color: item.status === "active" ? "white" : "lightgray",
//               backgroundColor: isHovered ? "rgba(255,255,255,0.1)" : "transparent",
//               borderRadius: "4px",
//               transition: "all 0.2s ease-in-out",
//             }}
//           >
//             <Link
//               to={item.status === "active" ? item.path : "#"}
//               className="d-flex align-items-center"
//               style={{
//                 textDecoration: "none",
//                 color: "inherit",
//                 width: "100%",
//               }}
//             >
//               <i
//                 className={`${item.icon} me-2`}
//                 title={!isOpen ? item.title : ""}
//               ></i>
//               {isOpen && <span>{item.title}</span>}
//             </Link>

//             {hasChildren && isOpen && (
//               <i
//                 className={`fas ${
//                   openItems[item.id] ? "fa-chevron-down" : "fa-chevron-right"
//                 }`}
//               ></i>
//             )}
//           </div>

//           {/* Expanded Submenu */}
//           {hasChildren && isOpen && openItems[item.id] && (
//             <ul className="nav flex-column ms-3 mt-1">
//               {renderMenu(item.children)}
//             </ul>
//           )}

//           {/* Flyout submenu on collapsed sidebar (desktop only) */}
//           {hasChildren && !isOpen && !isMobile && isHovered && (
//            <div
//     onMouseEnter={() => setHoveredItemId(item.id)}
//     onMouseLeave={() => setHoveredItemId(null)}
//     style={{
//       position: "fixed",    
//       top: 0,
//       left: 70,          
//       height: "100vh",
//       width: 250,
//       paddingTop: 60,    
//       backgroundColor: "rgba(11, 108, 179, 0.8)",
//       pointerEvents: "auto",
//       overflowY: "auto",
//       boxShadow: "none",
//       display: "flex",
//       flexDirection: "column",
//       zIndex: 10002,
//     }}
//   >
//             {item.children.map((child) => (
//       <Link
//         key={child.id}
//         to={child.path}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           color: "white",
//           padding: "10px 15px",
//           textDecoration: "none",
//           width: "100%",
//           boxSizing: "border-box",
//           cursor: "pointer",
//           userSelect: "none",
//         }}
//       >
//                   <i className={`${child.icon} me-2`}></i>
//              {child.title}
//              </Link>
//               ))}
//             </div>
//           )}

//           {/* Mobile collapsed submenu */}

//      {hasChildren && !isOpen && isMobile && openItems[item.id] && (
//           <ul className="nav flex-column ms-3 mt-1">
//             {item.children.map((child) => (
//               <li key={child.id}>
//                 <Link
//                   to={child.path}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     color: "white",
//                     padding: "6px 10px",
//                     textDecoration: "none",
                   
//                   }}
                  
//                 >
//                   <i className={`${child.icon} me-2`}></i>
//                   <span>{child.title}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}
//       </li>


//       );
//     });

//   return (
//     <div
//       className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}
//       style={{
//         width: isOpen ? "250px" : "70px",
//         height: "100vh",
//         background: "linear-gradient(135deg, #4b6cb7, #182848)",
//         padding: "20px 10px",
//         color: "white",
//         overflow: "visible",
//         transition: "width 0.3s ease-in-out",
//         position: "relative",
//         zIndex: 10000,
//       }}
//     >
//       {/* Logo */}
//       <div className="text-center mb-4">
//         <i className="fas fa-rocket fa-2x"></i>
//         {isOpen && <div className="mt-2 fw-bold">MyApp</div>}
//       </div>

//       {/* Menu */}
//       <div className="p-2 mt-2">
//         {isLoading ? (
//           <p>Loading menu...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : (
//           <ul className="nav flex-column">{renderMenu(menuItems)}</ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;













  // const renderMenu = (items) =>
  //   items.map((item) => (
  //     <li key={item.id} className="nav-item mb-2">
  //       <div
  //         className={`nav-link d-flex align-items-center justify-content-between ${
  //           item.status === "active" ? "text-white" : "text-secondary"
  //         }`}
  //         onClick={() => item.children?.length > 0 && toggleItem(item.id)}
  //         style={{
  //           cursor: item.children?.length > 0 ? "pointer" : "default",
  //           padding: "8px 10px",
  //         }}
  //       >
  //         <Link
  //           to={item.status === "active" ? item.path : "#"}
  //           className="d-flex align-items-center"
  //           style={{ textDecoration: "none", color: "inherit" }}
  //         >
  //           <i
  //             className={`${item.icon} me-2`}
  //             title={!isOpen ? item.title : ""}
  //           ></i>
  //           {isOpen && <span>{item.title}</span>}
  //         </Link>

  //         {item.children?.length > 0 && isOpen && (
  //           <i
  //             className={`fas ${
  //               openItems[item.id] ? "fa-chevron-down" : "fa-chevron-right"
  //             }`}
  //           ></i>
  //         )}
  //       </div>

  //       {item.children &&
  //         item.children.length > 0 &&
  //         openItems[item.id] &&
  //         isOpen && (
  //           <ul className="nav flex-column ms-3">
  //             {renderMenu(item.children)}
  //           </ul>
  //         )}
  //     </li>
  //   ));

//  const renderMenu = (items) =>
//   items.map((item) => {
//     const hasChildren = item.children && item.children.length > 0;
//     const isHovered = hoveredItemId === item.id;

//     return (
//       <li
//         key={item.id}
//         className="nav-item mb-2"
//         style={{ listStyle: "none", position: "relative" }}
//         onMouseEnter={() => !isOpen && hasChildren && setHoveredItemId(item.id)}
//         onMouseLeave={() => !isOpen && hasChildren && setHoveredItemId(null)}
//       >
//         <div
//           className={`nav-link d-flex align-items-center justify-content-between ${
//             item.status === "active" ? "text-white" : "text-secondary"
//           }`}
//           onClick={() => isOpen && hasChildren && toggleItem(item.id)}
//           style={{
//             cursor: hasChildren ? "pointer" : "default",
//             padding: "8px 10px",
//             textDecoration: "none",
//             color: "inherit",
//           }}
//         >
//           <Link
//             to={item.status === "active" ? item.path : "#"}
//             className="d-flex align-items-center"
//             style={{ textDecoration: "none", color: "inherit" }}
//           >
//             <i
//               className={`${item.icon} me-2`}
//               title={!isOpen ? item.title : ""}
//             ></i>
//             {isOpen && <span>{item.title}</span>}
//           </Link>

//           {hasChildren && isOpen && (
//             <i
//               className={`fas ${
//                 openItems[item.id] ? "fa-chevron-down" : "fa-chevron-right"
//               }`}
//             ></i>
//           )}
//         </div>

//         {/* Inline submenu when expanded */}
//         {hasChildren && isOpen && openItems[item.id] && (
//           <ul className="nav flex-column ms-3">
//             {renderMenu(item.children)}
//           </ul>
//         )}

//         {/* Flyout submenu when collapsed */}
//         {hasChildren && !isOpen && isHovered && (
//           <div
//             onMouseEnter={() => setHoveredItemId(item.id)}
//             onMouseLeave={() => setHoveredItemId(null)}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: "70px",
//               padding: "10px",
//               borderRadius: "4px",
//               display: "block",
//               zIndex: 9999,
//               whiteSpace: "nowrap",
//               minWidth: "150px",
//               background: "#1e3a8a", 
//               boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//             }}
//           >
//             {item.children.map((child) => (
//               <Link
//                 key={child.id}
//                 to={child.path}
//                 style={{
//                   display: "block",
//                   color: "white",
//                   padding: "6px 10px",
//                   textDecoration: "none",
//                 }}
//               >
//                 <i className={`${child.icon} me-2`}></i>
//                 {child.title}
//               </Link>
//             ))}
//           </div>
//         )}
//       </li>
//     );
//   });
