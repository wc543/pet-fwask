import { Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BackButton({pageName} : {pageName?: string}) {
    const navigate = useNavigate();
    console.log(pageName);
    return (
        <div style={{ margin: ''}}>
            <Link onClick={() => navigate(-1)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <Typography variant="subtitle1">{pageName? `Back to ${pageName}`: "Back" }</Typography>
            </Link>
        </div>

    );
}

export default BackButton;