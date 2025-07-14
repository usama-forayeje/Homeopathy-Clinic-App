ReactQueryProvider
import './../styles/globals.css'; 
import { Inter } from 'next/font/google';
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider'; // Adjust path based on your jsconfig.json alias

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}