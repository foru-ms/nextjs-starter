import "@/styles/globals.css";
import { PagesTopLoader } from 'nextjs-toploader/pages';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (<>
  <PagesTopLoader color="rgb(29 78 216)" />
  <Toaster />
  <Component {...pageProps} />
  </>
  );
}
