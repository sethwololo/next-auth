import { NextPage } from 'next';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard: NextPage = () => {
  const {user} = useContext(AuthContext);

  return (
    <div>
      <h1>Logado: {user?.email}</h1>
    </div>
  )
}

export default Dashboard;
