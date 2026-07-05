import { Roboto, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSortedPostsData, getCategories } from "@/lib/posts";
import "./globals.css";
import "./components.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Tool Guides",
  description: "Smart Tool Guides - We review the best SaaS products",
};

export default async function RootLayout({ children }) {
  const allPosts = await getSortedPostsData();
  const allCategories = await getCategories();
  
  return (
    <html lang="en" className={`${roboto.variable} ${oswald.variable}`}>
      <body>
        <Header posts={allPosts} categories={allCategories} />
        <main className="main-content">{children}</main>
        <Footer categories={allCategories} />
      </body>
    </html>
  );
}
