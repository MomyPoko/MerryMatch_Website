import MatchingPage from "@/components/matching/Matching";
import Navbar from "@/components/navbar/Navbar";
import { getServerSession } from "next-auth";

async function Matching() {
  const session = await getServerSession();
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex-none h-[88px]">
        <Navbar session={session} />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <MatchingPage />
      </div>
    </div>
  );
}

export default Matching;
