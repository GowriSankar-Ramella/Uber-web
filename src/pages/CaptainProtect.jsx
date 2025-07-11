
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const CaptainProtect = ({ children }) => {
    const captain = useSelector(store => store.captain?.captain)
    const loading = useSelector(store => store.captain?.isLoading)
    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!captain) {
        return <Navigate to="/captain-login" replace />
    }
    return children
}

export default CaptainProtect