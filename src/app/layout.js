import { Macondo, Montserrat, Roboto, Spicy_Rice } from "next/font/google";
import "./globals.css";
import RootProviders from "../components/providers/RootProviders";

const inter = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--inter",
});
const spiceRice = Spicy_Rice({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--spice-rice",
});
export const metadata = {
  title: "Invoice Generator",
  description: "Invoice Generator for Jaanavi Opticals ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${inter.className} `}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
