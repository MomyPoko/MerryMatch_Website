import RegisterPage from "@/components/register/RegisterPage";
import Navbar from "@/components/navbar/Navbar";
import { getServerSession } from "next-auth";

async function Register() {
  const session = await getServerSession();
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex-none h-[88px]">
        <Navbar session={session} />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <RegisterPage />
      </div>
    </div>
  );
}

export default Register;
