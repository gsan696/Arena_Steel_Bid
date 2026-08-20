import "./globals.css";

export const metadata = {
  title: "Arena Steel Bid",
  description:
    "Guided wizard for structural steel detailing estimation — upload, MTO, hours, pricing, and bid documents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
