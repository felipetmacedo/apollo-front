import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { UserCog, LogOut, ChartCandlestick } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { logout } from "@/utils/storage";
import { useUserStore } from "@/stores/user.store";
import imgLogo from "@/assets/img/bright-high-resolution-logo-transparent.svg";
import monogramLogo from "@/assets/img/monogram.svg";
import { motion } from "framer-motion";

export default function SideBar({ children }: { children: React.ReactNode }) {
    const { userInfo, clearUserInfo } = useUserStore();
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    const handleLogout = async () => {
        logout()

        clearUserInfo();
        navigate("/login");
        toast.success("Successfully logged out!")
    };

    const links = [
        {
            label: "Campaigns",
            href: "/campaigns",
            icon: <ChartCandlestick className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Profile",
            href: "/profile",
            icon: <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Logout",
            href: "#",
            icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            action: handleLogout,
        },
    ];

    return (
        <div className={cn("flex flex-col md:flex-row dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden", "h-screen w-screen")}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="relative h-6">
                            <motion.div
                                animate={{
                                    opacity: open ? 1 : 0,
                                    display: open ? "block" : "none"
                                }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0"
                            >
                                <Logo />
                            </motion.div>
                            <motion.div
                                animate={{
                                    opacity: open ? 0 : 1,
                                    display: open ? "none" : "block"
                                }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0"
                            >
                                <LogoIcon />
                            </motion.div>
                        </div>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) =>
                                link.action ? (
                                    <SidebarLink key={idx} link={link} onClick={link.action} />
                                ) : (
                                    <SidebarLink key={idx} link={link} />
                                )
                            )}
                        </div>
                    </div>
                    <div className={cn("flex items-center transition-all duration-300", open ? "justify-start gap-2" : "justify-center w-full")}>
                        <SidebarLink
                            link={{
                                label: open ? userInfo?.name || "" : "",
                                href: "/profile",
                                icon: (
                                    <span className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0">
                                        {userInfo?.name?.charAt(0)}
                                    </span>
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            {children}
        </div>
    );
}

export const Logo = () => (
    <Link to="#" className="flex items-center justify-start h-full">
        <img
            src={imgLogo}
            alt="logo"
            className="h-6 object-contain"
        />
    </Link>
);

export const LogoIcon = () => (
    <div className="flex items-center justify-center h-full">
        <img
            src={monogramLogo}
            alt="logo"
            className="h-6 w-6 object-contain"
        />
    </div>
);
