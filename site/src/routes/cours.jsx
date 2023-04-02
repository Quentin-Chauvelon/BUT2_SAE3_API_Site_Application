import { useNavigate } from "react-router-dom";
import '../assets/css/cours.css'

export default function Cours() {
    return (
        <div className="modal">
            <p>test</p>
            <button onClick={() => navigate(-1)}>Close</button>
        </div>
    )
}