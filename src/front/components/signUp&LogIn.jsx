import React, { useState } from "react"
import { Secret } from "../pages/secret"
import { jwtDecode } from "jwt-decode"
import '../index.css'

export const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [statusMessage, setStatusMessage] = useState("")
    const [token, setToken] = useState(null)
    // const [userEmail, setUserEmail] =({"email": ""})
    const [user, setUser] = useState({ "email": "" })
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    function isTokenValid(myToken) {


        if (!myToken) return false;
        try {
            const { exp } = jwtDecode(myToken);
            console.log("this is the exp: ", exp)
            console.log("this is the date: ", Date.now())
            if (Date.now() >= exp * 1000) return false; // expired

            return true;
        } catch (e) {
            return false; // invalid token format
        }
    }

    const signingUp = () => {
        let options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
        fetch(backendUrl + "/sign_up", options)
            .then((resp) => resp.json())
            .then((data) =>
                setStatusMessage(data.message), // This .message comes from the response body within the routes.py. Specifically line 28
                // setUserEmail(data.user)    
            )
    }

    const logingIn = () => {
        let options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
        fetch(backendUrl + "/login", options)
            .then((resp) => resp.json())
            .then((data) => {
                setStatusMessage(data.message),
                    setUser(data.user),
                    setToken(data.token),
                    isTokenValid(data.token)
            })
    }

    const logOut = () => {
        setUser({ "email": "" })
        setToken(null)
        setStatusMessage("")
    }

    return (
        <div className="container justify-content-center">
            <h1>Sign Up or Log In</h1>

            <div className="background justify-content-center">
                <h3>{statusMessage + user.email}</h3>

                <div className="">
                    <div className="email">
                        Enter E-Mail:
                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />

                    </div>

                    <div className="pass">
                        Enter Password:
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row justify-content-center">

                    <div className="col-2">
                        <button
                            className="buttons btn btn-success"
                            onClick={signingUp}>
                            Sign Up
                        </button>
                    </div>

                    <div className="col-2">
                        <button className="buttons btn btn-primary" onClick={logingIn}>Log In</button>
                    </div>

                    <div className="col-2">
                        <button
                            className="buttons btn btn-danger"
                            onClick={logOut}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
            {
                token == null && !isTokenValid() ? ""
                    :
                    <Secret />
            }
        </div>
    )
}