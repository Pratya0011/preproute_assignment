import Root from "./Root";
import {createBrowserRouter} from "react-router-dom";
import Dashboaard from "./Components/Dashboard";
import AuthWrapper from "./authWrapper";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "",
                element: (
                    <AuthWrapper>
                        <Dashboaard/>
                    </AuthWrapper>
                )
                
            }
        ]
    }
])

export default router