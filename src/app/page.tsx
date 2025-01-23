import HomePage from "@/components/homepage/Home";
import Navbar from "@/components/navbar/Navbar";
import { getServerSession } from "next-auth";

async function Home() {
  const session = await getServerSession();
  return (
    <>
      <Navbar session={session} />
      <HomePage />
    </>
  );
}

export default Home;
