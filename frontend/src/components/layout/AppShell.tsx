import React, { ReactNode, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Upload,
  FileSearch,
  AlertTriangle,
  ShieldAlert,
  FlaskConical,
  ShieldCheck,
  Bot,
  FileText,
  BarChart3,
  User,
  Settings,
} from "lucide-react";

interface AppShellProps {
  children: ReactNode;
}

interface UserData {
  id?: number;
  name?: string;
  email?: string;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  badge?: string;
  badgeText?: string;
}

export function AppShell({
  children,
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const token =
    localStorage.getItem("access_token");

  /*
   * =========================================================
   * PUBLIC PAGES
   * =========================================================
   */

  const publicPages = [
    "/login",
    "/register",
  ];

  const isPublicPage =
    publicPages.includes(location.pathname);


  /*
   * =========================================================
   * AUTH REDIRECT
   * =========================================================
   */

  useEffect(() => {
    if (!token && !isPublicPage) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [
    token,
    isPublicPage,
    navigate,
  ]);


  /*
   * Login and Register should not have
   * the dashboard sidebar/header.
   */

  if (isPublicPage) {
    return <>{children}</>;
  }


  /*
   * Wait for redirect if there is
   * no authentication token.
   */

  if (!token) {
    return null;
  }


  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };


  /*
   * =========================================================
   * SIDEBAR MENU
   * =========================================================
   */

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },

    {
      name: "Upload DPR",
      path: "/upload",
      icon: Upload,
    },

    {
      name: "DPR Analysis",
      path: "/dpr-analysis",
      icon: FileSearch,
    },

    {
      name: "Contradictions",
      path: "/contradictions",
      icon: AlertTriangle,
      badge: "5",
    },

    {
      name: "Risk Intelligence",
      path: "/risk-intelligence",
      icon: ShieldAlert,
    },

    {
      name: "What-If Simulator",
      path: "/simulator",
      icon: FlaskConical,
    },

    {
      name: "Mitigation Advisor",
      path: "/mitigation",
      icon: ShieldCheck,
    },

    {
      name: "DPR Copilot",
      path: "/copilot",
      icon: Bot,
      badgeText: "AI",
    },

    {
      name: "Evidence Viewer",
      path: "/evidence",
      icon: FileText,
    },

    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },

    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];


  /*
   * =========================================================
   * USER
   * =========================================================
   */

  const user = getUser();

  const userName =
    user?.name || "User";

  const userEmail =
    user?.email || "";

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();


  /*
   * =========================================================
   * APP SHELL
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-gray-100 flex">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className="
          w-64
          bg-white
          border-r
          border-gray-200
          fixed
          left-0
          top-0
          bottom-0
          flex
          flex-col
          z-40
        "
      >

        {/* ===================================================
            LOGO
        =================================================== */}

        <div
          className="
            px-6
            py-6
            border-b
            border-gray-200
          "
        >

          <div className="flex items-center gap-3">

            {/* Logo icon */}

            <div
              className="
                w-9
                h-9
                rounded-lg
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                shadow-sm
              "
            >
              <ShieldCheck
                size={20}
                strokeWidth={2}
              />
            </div>


            <div>

              <h1
                className="
                  text-lg
                  font-bold
                  text-gray-900
                  leading-tight
                "
              >
                AI DPR Risk
              </h1>

              <p
                className="
                  text-[11px]
                  text-gray-500
                  mt-0.5
                "
              >
                Risk Assessment Platform
              </p>

            </div>

          </div>

        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav
          className="
            flex-1
            px-3
            py-4
            overflow-y-auto
          "
        >

          {menuItems.map((item) => {

            const isActive =
              location.pathname ===
              item.path;

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  mb-1
                  rounded-lg
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >

                {/* ICON */}

                <Icon
                  size={18}
                  strokeWidth={1.9}
                  className="shrink-0"
                />


                {/* NAME */}

                <span className="flex-1">
                  {item.name}
                </span>


                {/* NUMBER BADGE */}

                {item.badge && (
                  <span
                    className="
                      min-w-[20px]
                      h-[20px]
                      px-1
                      rounded-full
                      bg-red-500
                      text-white
                      text-[10px]
                      font-bold
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {item.badge}
                  </span>
                )}


                {/* AI BADGE */}

                {item.badgeText && (
                  <span
                    className="
                      px-2
                      py-0.5
                      rounded
                      bg-cyan-50
                      text-cyan-600
                      border
                      border-cyan-100
                      text-[9px]
                      font-bold
                    "
                  >
                    {item.badgeText}
                  </span>
                )}

              </Link>
            );
          })}

        </nav>


        {/* ===================================================
            USER SECTION
        =================================================== */}

        <div
          className="
            p-4
            border-t
            border-gray-200
          "
        >

          <Link
            to="/profile"
            className="
              flex
              items-center
              gap-3
              p-2
              rounded-lg
              hover:bg-gray-50
              transition
            "
          >

            {/* Avatar */}

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                font-semibold
                shrink-0
              "
            >
              {userInitial}
            </div>


            {/* User details */}

            <div className="min-w-0 flex-1">

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                  truncate
                "
              >
                {userName}
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                  truncate
                "
              >
                {userEmail}
              </p>

            </div>

          </Link>


          {/* Logout */}

          <button
            onClick={handleLogout}
            className="
              mt-3
              w-full
              px-4
              py-3
              rounded-lg
              bg-red-50
              text-red-600
              hover:bg-red-100
              font-medium
              text-sm
              transition
            "
          >
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div
        className="
          ml-64
          flex-1
          min-h-screen
        "
      >


        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header
          className="
            h-16
            bg-white
            border-b
            border-gray-200
            flex
            items-center
            justify-between
            px-8
            sticky
            top-0
            z-30
          "
        >

          {/* Page title */}

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-gray-800
              "
            >
              AI DPR Risk Assessment
            </h2>

          </div>


          {/* User */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div className="text-right">

              <p
                className="
                  text-sm
                  font-medium
                  text-gray-800
                "
              >
                {userName}
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                {userEmail}
              </p>

            </div>


            {/* Header avatar */}

            <Link
              to="/profile"
              className="
                w-9
                h-9
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                font-semibold
                hover:bg-blue-700
                transition
              "
            >
              {userInitial}
            </Link>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}


/* =========================================================
   USER HELPER
========================================================= */

function getUser(): UserData | null {
  try {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(
      storedUser
    ) as UserData;

  } catch (error) {

    console.error(
      "Unable to read user:",
      error
    );

    return null;
  }
}