import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@/features/Login";
import { Profile } from "@/features/Profile/Profile";
import Signup from "@/features/Signup";
import RequestPasswordReset from "@/features/RequestPasswordReset";
import About from "@/features/About";
import { PublicLayout } from "@/layouts/PublicLayout";
import Plans from "@/features/Plans";

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <About />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/request-password-reset",
                element: <RequestPasswordReset />
            },
            {
                path: "/pricing",
                element: <Plans />
            }
        ]
    },
    {
        path: "/app",
        element: <App />,
        children: [
            {
                path: "profile",
                element: <Profile />
            }
        ]
    }
]);