export default function Salle() {
    return (
        <>
        <div className="rechercheSalle">
            <p className="Sc grand">&nbsp;Service de recherche de Salles&nbsp;</p>
            <div className="barreRecherche">
                <button className="Sc">Recherche des Salles disponibles</button>
                <div className="switch-holder">
                    <div className="switch-label">
                        <span className="Sc">Info</span>
                    </div>
                    <div className="switch-toggle">
                        <input type="checkbox" id="informatique"/>
                        <label htmlFor="informatique"></label>
                    </div>
                </div>
            </div>
        </div>
        </>)
}