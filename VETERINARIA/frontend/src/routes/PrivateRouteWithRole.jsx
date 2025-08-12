import storeAuth from '../context/storeAuth';
import { Forbidden } from '../pages/Forbidden';

export default function PrivateRouteWithRole({ children, allow = ['administrador'] }) {
  const { rol } = storeAuth();
  return allow.includes(rol) ? children : <Forbidden />;
}