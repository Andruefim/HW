import { Button } from "react-bootstrap";
import history from "../history";
import houseSvg from "../icons/house.svg";

export const ButtonToMain = () => (
    <>
        <Button className="gradient mb-2 ms-2 rounded-3" variant="success btn-sm" onClick={() => history.push("/main")}>
            <i className="bi bi-house-door"></i> Main page
        </Button>
    </>
);
