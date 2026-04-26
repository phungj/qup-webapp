import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faHome} from '@fortawesome/free-solid-svg-icons'


type NavbarProps = {
    homeButtonHandler: () => void,
    helpButtonHandler: () => void
}

export default function Navbar({homeButtonHandler, helpButtonHandler}: NavbarProps) {
    return (
        <div className="navbar flex items-center justify-between absolute top-0 left-0 w-full">
            <FontAwesomeIcon icon={faHome} size="2xl" onClick={homeButtonHandler}/>
            <FontAwesomeIcon icon={faQuestionCircle} size="2xl" onClick={helpButtonHandler}/>
        </div>
    );
}