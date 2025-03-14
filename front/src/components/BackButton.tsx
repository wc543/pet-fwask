import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();

    return (
        <div >
            <Link onClick={() => navigate(-1)}>
                Back
            </Link>
        </div>

    );
}

export default BackButton;