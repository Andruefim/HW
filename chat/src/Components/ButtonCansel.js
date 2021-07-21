import { Button } from "react-bootstrap";
import history from "../history";
import houseSvg from "../icons/house.svg";

export const ButtonCancel = ({ cansel = () => history.goBack() }) => (
    <>
        <Button className="gradient rounded-3 ms-2 mb-2" variant="secondary btn-sm" onClick={cansel}>
            <span className="ms-2">Cancel</span>
        </Button>
    </>
);
