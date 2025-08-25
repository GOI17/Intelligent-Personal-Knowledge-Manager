'use client';

import { store } from '../app/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
