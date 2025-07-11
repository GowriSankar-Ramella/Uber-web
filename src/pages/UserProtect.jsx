
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const UserProtect = ({ children }) => {
    const user = useSelector(store => store.user?.user)
    const loading = useSelector(store => store.user?.isLoading)
    if (loading) {
        return <h1>Loading..</h1>
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default UserProtect