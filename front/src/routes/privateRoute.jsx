import { Navigate } from 'react-router-dom';


function PrivateRoute({ children, ...rest }) {
    const user = sessionStorage.getItem('usuario')

    return user ? children : <Navigate to="/" />;
}

export default PrivateRoute
