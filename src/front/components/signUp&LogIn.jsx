import React, { useState } from "react"
import { Secret } from "../pages/secret"
import {jwtDecode} from "jwt-decode"

export const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [statusMessage, setStatusMessage] = useState("")
    const [token, setToken] = useState(null)
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
            .then((data) => setStatusMessage(data.message)) // This .message comes from the response body within the routes.py. Specifically line 28
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



    return (
        <div>
            <div>
                Enter E-Mail:
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />

            </div>

            <div>
                Enter Password:
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={signingUp}>Sign Up</button>
            <button onClick={logingIn}>Log In</button>
            {statusMessage + user.email}
            {
                token == null && !isTokenValid() ? ""
                    :
                    <Secret />
            }
        </div>
    )
}

