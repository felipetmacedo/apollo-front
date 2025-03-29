import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@/features/Login";
import { Profile } from "@/features/Profile/Profile";
import RequestPasswordReset from "@/features/RequestPasswordReset";
import About from "@/features/About";
import { PublicLayout } from "@/layouts/PublicLayout";
import Plans from "@/features/Plans";
import Dashboard from "@/features/Dashboard";

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
            },
            {
                path: "dashboard",
                element: <Dashboard />
            }
        ]
    }
]);