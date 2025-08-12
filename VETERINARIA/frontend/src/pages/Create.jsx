import { Form } from '../components/create/Form'
import FormAfiliado from '../components/afiliado/FormAfiliado' // nuevo
import storeAuth from '../context/storeAuth';

/*const Create = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Agregar</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este módulo te permite gestionar registros</p>
            <Form />
        </div>
    )
}*/
const Create = () => {
  const { rol } = storeAuth();
  return (
    <div>
      <h1 className='font-black text-4xl text-gray-500'>Crear</h1>
      <hr className='my-4 border-t-2 border-gray-300' />
      <p className='mb-8'>Este módulo te permite gestionar registros</p>
      {rol === 'administrador' ? <Form /> : <FormAfiliado />}
    </div>
  );
}
export default Create