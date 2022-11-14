import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/Context/AuthProvider";

function Home() {
    const {
        user: { displayName },
    } = useContext(AuthContext);

    
    return (
        <div>
            <div>
                <h1>
                    <Link to="/login">Login</Link>
                </h1>
                <br />
                <h1>
                    <Link to="/signup">Signup</Link>
                </h1>
            </div>

            <br />
            <br />
            <br />

            <h2>{displayName ? `Welcome - ${displayName}` : "Login please"}</h2>
        </div>
    );
}

export default Home;
