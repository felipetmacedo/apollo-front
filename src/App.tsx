import { Outlet } from "react-router-dom";
import { useUserStore } from "./stores/user.store";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "./processes/user";
import { Loader } from "lucide-react";
import { SideBar } from "@/components/Sidebar";

function App() {
  const { setUserInfo } = useUserStore();

  const { isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userInfo = await getUserInfo();

      if (userInfo) {
        setUserInfo(userInfo);
      }

      return userInfo;
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading your information...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        <SideBar>
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </SideBar>
      </div>
    </>
  );
}

export default App;
