import Layout from "./components/layout";
import Login from "./pages/login";
import Home from "./pages/home";

import Ocorrencia from "./pages/ocorrencia"
import Cliente from "./pages/cliente"
import { useState } from "react";
import PaginaErro from "./pages/paginaErro";
import Solucao from "./pages/solucao";
import PrivateRoute from "./routes/privateRoute";
import MudarSenha from "./pages/mudarSenha";

import './styles/geral.css'

import {
  createBrowserRouter,
  RouterProvider,
  useRoutes
} from "react-router-dom";

function App() {
  const [tituloParametro, setTituloParametro] = useState({
    ocorrencia: '',
    solucao: ''
  })

  function handleTitulo(chave, titulo) {
    setTituloParametro((estadoAnterior) => {
      return { ...estadoAnterior, [chave]: titulo }
    })
  }



  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <Login />,
    },
    {
      path: "/home",
      element: (
        <PrivateRoute>
          <Layout titulo="Lista de Ocorrências">
            <Home />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/ocorrencia",
      element: (
        <PrivateRoute>
          <Layout titulo="Cadastrar Ocorrência">
            <Ocorrencia />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/ocorrencia/:numOcorrencia",
      element: (
        <PrivateRoute>
          <Layout titulo={tituloParametro.ocorrencia}>
            <Ocorrencia setTitulo={handleTitulo} />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/cliente",
      element: (
        <PrivateRoute>
          <Layout titulo="Cadastrar Cliente">
            <Cliente />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/solucao/:numOcorrencia",
      element: (
        <PrivateRoute>
          <Layout titulo={tituloParametro.solucao}>
            <Solucao setTitulo={handleTitulo} />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/mudar-senha",
      element: (
        <PrivateRoute>
          <Layout titulo="Mudar Senha">
            <MudarSenha />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/404",
      element: <PaginaErro />
    },
  ]);


  return (

    <RouterProvider router={router} />

  );
}

export default App;
