
import './App.css';
import CreateZoneLeaderForm from './components/CreateZoneLeaderForm';

// Default initial values for the form
const defaultInitialValues = {
    name : '',
    lastName : '',
    documentId : '',
    address : '',
    leaderCode : '',
    email : '',
    cellphone : '',
    zone : '',
    endContractDate : '',
}

// Keys for labeling inputs
const labelKeys = {
    name : 'Nombre',
    lastName : 'Apellido',
    documentId : 'Documento de identidad',
    address : 'Dirección',
    leaderCode : 'Código de líder',
    email : 'Email',
    cellphone : 'Número celular',
    zone : 'Zona',
    endContractDate : 'Fecha fin de contrato',
}

const typeKeys = {
    name : 'text',
    lastName : 'text',
    documentId : 'number',
    address : 'text',
    leaderCode : 'number',
    email : 'email',
    cellphone : 'number',
    zone : 'select',
    endContractDate : 'date',
}

const selectValues = {
    zone : [
      '--Elija una zona--',
      'Norte',
      'Sur'
    ]
}

function App() {
  return (
    <div>
     <CreateZoneLeaderForm
      defaultInitialValues={defaultInitialValues}
      labelKeys={labelKeys}
      typeKeys={typeKeys}
      selectValues={selectValues}
     />
    </div>
  );
}

export default App;
