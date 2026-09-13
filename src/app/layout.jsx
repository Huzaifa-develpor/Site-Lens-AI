import './globals.css';

export const metadata = {
  title: 'SiteLens AI - Automated Website Audit & Optimization',
  description: 'AI-powered website diagnostic tool for SEO, UX, Accessibility, and Conversion optimization.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f17] text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}