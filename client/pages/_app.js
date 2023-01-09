import '../styles/globals.css'

// Internal imports
import { ChatAppProvider } from '../Context/ChatAppContext';
import { Navbar } from '../components/index';

const App = ({ Component, pageProps }) => {
  return (
    <div>
        <ChatAppProvider>
           <Navbar/>
           <Component {...pageProps} />
        </ChatAppProvider>
    </div> 
  )
}

export default App;