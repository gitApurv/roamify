import { useState, useEffect } from "react";
import Map, {
  Marker,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import GeocoderControl from "./components/GeocoderControl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import RoomIcon from "@mui/icons-material/Room";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Modal from "./components/Modal";
import StyledPopup from "./components/StyledPopup";
import LogEntryForm from "./components/LogEntryForm";
import LogEditForm from "./components/LogEditForm";
import { listLogEntries, deleteLogEntry, logout } from "./api/api";
import "./styles/index.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState({});
  const [editEntry, setEditEntry] = useState({});
  const [showPopup, setShowPopup] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);

  // Function to load all Entries
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  // Checking state of User
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/check`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLoggedIn(data.loggedIn))
      .catch((err) => {
        setLoggedIn(false);
      });
  }, []);

  // Showing Entries according to User state
  useEffect(() => {
    if (loggedIn) getEntries();
    else setLogEntries([]);
  }, [loggedIn]);

  // Edit handling function
  const handleEdit = async (entry) => {
    setEditEntry(entry);
  };

  // Delete handling function
  const handleDelete = async (entry) => {
    await deleteLogEntry(entry._id);
    getEntries();
  };

  // Add new Entry handling function
  const showAddMarkerPopup = (event) => {
    const { lng, lat } = event.lngLat;
    setAddEntryLocation({
      longitude: lng,
      latitude: lat,
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Authentication Menu */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 60, sm: 16 },
          left: { xs: "auto", sm: "auto" },
          right: { xs: 8, sm: 16 },
          zIndex: 20,
        }}
      >
        <IconButton
          id="basic-button"
          onClick={handleClick}
          aria-controls={Boolean(anchorEl) ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? "true" : undefined}
        >
          <AccountCircleIcon sx={{ fontSize: 36, color: "primary.main" }} />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ mt: 1 }}
        >
          {!loggedIn ? (
            [
              <MenuItem
                key="login"
                onClick={() => {
                  setShowSignupForm(false);
                  setShowLoginForm((prev) => !prev);
                  setAnchorEl(null);
                }}
              >
                Login
              </MenuItem>,
              <MenuItem
                key="signup"
                onClick={() => {
                  setShowSignupForm((prev) => !prev);
                  setShowLoginForm(false);
                  setAnchorEl(null);
                }}
              >
                Signup
              </MenuItem>,
            ]
          ) : (
            <MenuItem
              onClick={async () => {
                await logout();
                setLoggedIn(false);
                setAnchorEl(null);
              }}
            >
              Logout
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* Map Component */}
      <Map
        initialViewState={{
          longitude: 77.216721,
          latitude: 28.6448,
          zoom: 5,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY
          }`}
        doubleClickZoom={false}
        onDblClick={showAddMarkerPopup}
      >
        <GeocoderControl
          position="top-left"
          marker={false}
          placeholder="Search for a place"
        />
        <GeolocateControl
          position="bottom-right"
          positionOptions={{
            enableHighAccuracy: true,
            trackUserLocation: true,
          }}
          showAccuracyCircle={false}
        />
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Markers */}
        {logEntries.map((entry) => (
          <Marker
            key={entry._id}
            longitude={entry.longitude}
            latitude={entry.latitude}
            anchor="bottom"
            onClick={() => setShowPopup({ [entry._id]: true })}
          >
            <RoomIcon
              sx={{ color: "error.main", fontSize: 48, cursor: "pointer" }}
            />
          </Marker>
        ))}

        {/* Add Entry Marker */}
        {Number.isFinite(addEntryLocation?.latitude) &&
          Number.isFinite(addEntryLocation?.longitude) && (
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <RoomIcon sx={{ color: "error.main", fontSize: 48 }} />
            </Marker>
          )}

        {/* Edit Entry Marker */}
        {Number.isFinite(editEntry?.latitude) &&
          Number.isFinite(editEntry?.longitude) && (
            <Marker
              latitude={editEntry.latitude}
              longitude={editEntry.longitude}
            >
              <RoomIcon sx={{ color: "error.main", fontSize: 48 }} />
            </Marker>
          )}
      </Map>

      {/* Login & Signup Forms Modal */}
      <Modal
        isOpen={showLoginForm || showSignupForm}
        onClose={() => {
          setShowLoginForm(false);
          setShowSignupForm(false);
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {showLoginForm ? "Login" : "Sign Up"}
          </Typography>
        </Box>
        {showLoginForm ? (
          <LoginForm
            onClose={() => {
              setShowLoginForm(false);
              setLoggedIn(true);
            }}
          />
        ) : (
          <SignupForm
            onClose={() => {
              setShowSignupForm(false);
              setLoggedIn(true);
            }}
          />
        )}
      </Modal>

      {/* Entry Details Modal */}
      {Object.keys(showPopup).length > 0 && (
        <Modal
          isOpen={true}
          onClose={() => setShowPopup({})}
        >
          {Object.entries(showPopup).map(([entryId, isOpen]) => {
            if (!isOpen) return null;
            const entry = logEntries.find((e) => e._id === entryId);
            return (
              <StyledPopup
                key={entryId}
                entry={entry}
                onEdit={(entry) => {
                  setShowPopup({});
                  handleEdit(entry);
                }}
                onDelete={(entry) => {
                  setShowPopup({});
                  handleDelete(entry);
                }}
              />
            );
          })}
        </Modal>
      )}

      {/* Add Entry Modal */}
      <Modal
        isOpen={Number.isFinite(addEntryLocation?.latitude) && Number.isFinite(addEntryLocation?.longitude)}
        onClose={() => setAddEntryLocation(null)}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            Add Travel Log
          </Typography>
        </Box>
        {Number.isFinite(addEntryLocation?.latitude) && (
          <LogEntryForm
            loggedIn={loggedIn}
            location={addEntryLocation}
            onClose={() => {
              setAddEntryLocation(null);
              getEntries();
            }}
          />
        )}
      </Modal>

      {/* Edit Entry Modal */}
      <Modal
        isOpen={Number.isFinite(editEntry?.latitude) && Number.isFinite(editEntry?.longitude)}
        onClose={() => setEditEntry(null)}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            Edit Travel Log
          </Typography>
        </Box>
        {Number.isFinite(editEntry?.latitude) && (
          <LogEditForm
            entry={editEntry}
            onClose={() => {
              setEditEntry(null);
              getEntries();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
