import React from "react";
import { useUser } from "../contexts/UserContext";
import { Card } from "../components/common";

const Profile = () => {
  const { currentUser } = useUser();

  return (
    <div>
      <h1 style={{ color: "white", marginBottom: "24px" }}>Profil</h1>
      <Card>
        <h2 style={{ color: "white", marginBottom: "16px" }}>{currentUser?.username}</h2>
        <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>Email: {currentUser?.email}</p>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", marginTop: "8px" }}>
          Page de profil en cours de développement...
        </p>
      </Card>
    </div>
  );
};

export default Profile;
