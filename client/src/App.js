import { useState, useEffect } from "react";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import "./app.css";
import Register from "./components/Register";
import Login from "./components/Login"
function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 40.71506434201678,
    longitude: -73.99684811789366,
    zoom: 10,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get("/pins");
        setPins(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, lattitude: lat, longitude: long });
  };

  //double Click to add new place
  const handleAddClick = (e) => {
    const [long, lat] = e.lnglat;
    setNewPlace({
      lat,
      long,
    });
  };

const handleSubmit = (e) =>{
  e.preventDefault()
  const newPin = {
    username: currentUser,
    title,
    desc,
    rating,
    lat:newPlace.lat,
    long:newPlace.long
  }
  try {
    const res = await axios.post("/pins", newPin);
    setPins([...pins, res.data]);
    setNewPlace(null);
  } catch (err) {
    console.log(err);
  }
}

  return (
    <div className="App">
      <ReactMapGl
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/shansiddiqui94/ckymlk1in22xu14pewxn6niqm"
        onDoubleClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={40.7607183218919}
              longitude={-73.8311948975521}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 7,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              ></Room>

            </Marker>
            {p._id === currentPlaceId && ( // if pin id = current id open popup
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                  {Array(p.rating).fill(<Star className="star"/>)}
                  </div>
                  <label>Info </label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}

        ))}
        </>
        // {newPlace && (

        //   <Popup
        //     latitude={newPlace.lat}
        //     longitude={newPlace.long}
        //     closeButton={true}
        //     closeOnClick={false}
        //     anchor="left"
        //     onClose={() => setCurrentPlaceId(null)}
        //   >
        //     <div>
        //       <form onSubmit={handleSubmit}>
        //         <label>Title</label>
        //         <input placeholder="enter title" onChange={(e)=> setTitle(e.target.value)} />
        //         <label>Review</label>
        //         <textarea placeholder="Write a review" onChange={(e)=> setDesc(e.target.value)}/>
        //         <label>Rating</label>
        //         <select onChange={(e)=> setRating(e.target.value)}>
        //           <option value="1">1</option>
        //           <option value="2">2</option>
        //           <option value="3">3</option>
        //           <option value="4">4</option>
        //           <option value="5">5</option>
        //         </select>
        //         <button className="submitBtn" type="submit">
        //           Add Pin
        //         </button>
        //       </form>
        //     </div>
        //   </Popup>
        // )}
        {currentUser ? (<button className="button logout">Log Out</button>): (
        <div>
        <button className="button login">Login</button>
        <button className="button register">Register</button>
        </div>
        )}
        <Register />
      </ReactMapGl>
    </div>
  );
}

export default App;
