import "./globals.css";

export const metadata = {
  title: "Reactadelphia",
  description:
    "The premiere Philadelphia React Community dedicated to upskilling, networking, and building your React knowledge to secure your next job or promotion!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
