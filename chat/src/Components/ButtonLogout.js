import { actionAuthLogout } from "../Actions";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

const ButtonLogout = ({ onLogout, isLoggedIn }) => (
    <Button className="gradient m-2 mx-5" variant="secondary btn-sm" onClick={onLogout} disabled={!isLoggedIn}>
         Logout
    </Button>
);
export const CButtonLogout = connect((s) => ({ isLoggedIn: s.auth.login }), { onLogout: actionAuthLogout })(
    ButtonLogout
);
