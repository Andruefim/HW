import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const ButtonUpload = ({ isLoggedIn }) => (
    <Link to={"/upload"}>
        <Button className="gradient mx-2" variant="success btn-sm" disabled={!isLoggedIn}>
            Upload
        </Button>
    </Link>
);

export const CButtonUpload = connect((s) => ({ isLoggedIn: s.auth.login }))(ButtonUpload);
