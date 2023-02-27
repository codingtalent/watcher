//import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';


const Providers = ({ children }: { children: ReactNode}) => {
  return (
    <ErrorBoundary>
      <Layout>{children}</Layout>
    </ErrorBoundary>
  );
};

export default Providers;
