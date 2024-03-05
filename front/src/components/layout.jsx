import Header from "../components/partials/header";
import Footer from "../components/partials/footer";
import Sidebar from "../components/sidebar";

function Layout({titulo, children }) {
    console.log('layout', titulo)
    return (
      <div className="App">
        <Sidebar />
        <div className="content">
          <Header titulo={titulo}/>
          {children}
          <Footer/>
        </div>
      </div>
    );
  }

  export default Layout