
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText,
  FiLogOut,
  FiMap,
  FiPlus,
  FiSidebar,
  FiStar,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { GiArtificialHive, GiTwoCoins } from "react-icons/gi";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  {
    icon: <FiFileText />,
    label: "Resume Builder",
    path: "/resume",
  },
  {
    icon: <FiStar />,
    label: "Resume Scorer",
    path: "/scorer",
  },
  {
    icon: <FiMap />,
    label: "Roadmap Builder",
    path: "/roadmap",
  },
];

const Sidebar = ({
  user,
  onNewInterview,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  mobileOpen,
  setMobileOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const avatar = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Reusable sidebar content
  const renderSidebarContent = (expanded, isMobile = false) => (
    <div className="flex h-full w-full flex-col bg-white">

      {/* HEADER */}
      <div
        className={`relative flex h-[76px] shrink-0 items-center border-b border-slate-200/80 px-4 ${
          expanded ? "justify-between" : "justify-center"
        }`}
      >
        {/* Logo */}
        <div
          className={`group/logo relative flex min-w-0 items-center gap-3 ${
            expanded ? "" : "h-11 w-11 justify-center"
          }`}
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70 transition-opacity duration-200 ${
              !expanded && !isMobile ? "group-hover/logo:opacity-0" : ""
            }`}
          >
            <GiArtificialHive className="text-2xl" />
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap text-xl font-extrabold tracking-tight text-slate-900"
              >
                Fresher<span className="text-indigo-600">AI</span>
              </motion.span>
            )}
          </AnimatePresence>

          {/* Collapsed desktop toggle */}
          {!expanded && !isMobile && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Expand sidebar"
              className="absolute inset-0 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-white/95 text-slate-500 opacity-0 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 group-hover/logo:opacity-100"
            >
              <FiSidebar className="text-xl" />
            </motion.button>
          )}
        </div>

        {/* Expanded desktop toggle */}
        {expanded && !isMobile && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Collapse sidebar"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <FiSidebar className="text-xl" />
          </motion.button>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <motion.button
            type="button"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            <FiX className="text-xl" />
          </motion.button>
        )}
      </div>

      {/* CREATE INTERVIEW */}
      <div className="px-3 pb-5 pt-5">
        <motion.button
          type="button"
          onClick={onNewInterview}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className={`flex h-12 w-full cursor-pointer items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60 transition hover:shadow-indigo-300/70 ${
            expanded ? "justify-start gap-3 px-4" : "justify-center px-0"
          }`}
        >
          <FiPlus className="shrink-0 text-xl" />

          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap text-sm font-bold"
              >
                Create Interview
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3">
        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"
            >
              Agents
            </motion.p>
          )}
        </AnimatePresence>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((nav, index) => {
            const active = location.pathname === nav.path;

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => {
                  navigate(nav.path);
                  setMobileOpen(false);
                }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                title={!expanded ? nav.label : ""}
                className={`group relative flex h-12 w-full cursor-pointer items-center rounded-xl transition-all duration-200 ${
                  expanded ? "gap-3 px-3" : "justify-center px-0"
                } ${
                  active
                    ? "bg-indigo-50 font-semibold text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId={
                      isMobile
                        ? "mobile-active-nav"
                        : "desktop-active-nav"
                    }
                    className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-indigo-600"
                  />
                )}

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition-colors ${
                    active
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-400 group-hover:text-indigo-600"
                  }`}
                >
                  {nav.icon}
                </span>

                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="whitespace-nowrap text-sm font-medium"
                    >
                      {nav.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mt-auto shrink-0 border-t border-slate-200/80 p-3">

        {/* INTERVIEW COINS */}
        <motion.div
          onClick={() => navigate("/pricing")}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          title={
            !expanded
              ? `Interview Coins: ${user?.interviewCoin ?? 0}`
              : ""
          }
          className={`mb-4 flex cursor-pointer items-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 p-3 transition hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/60 ${
            expanded ? "gap-3" : "justify-center"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-indigo-600 shadow-sm">
            <GiTwoCoins />
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Interview Coins
                </p>

                <p className="text-lg font-extrabold text-slate-900">
                  {user?.interviewCoin ?? 0}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {expanded && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
              <FaCirclePlus />
            </div>
          )}
        </motion.div>

        {/* USER PROFILE */}
        <div
          className={`flex items-center ${
            expanded ? "gap-3" : "justify-center"
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-extrabold text-indigo-600 ring-2 ring-white">
            {avatar}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-sm font-bold text-slate-800">
                  {user?.name ?? "User"}
                </p>

                <p className="truncate text-[11px] text-slate-400">
                  {user?.email ?? "user@email.com"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {expanded && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogout}
              aria-label="Logout"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <FiLogOut className="text-lg" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 312 : 88 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-slate-200/80 bg-white md:block"
      >
        {renderSidebarContent(sidebarOpen)}
      </motion.aside>

      {/* MOBILE MENU BUTTON */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        className="fixed left-4 top-4 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-lg shadow-indigo-100/50 md:hidden"
      >
        <FiMenu className="text-xl" />
      </motion.button>

      {/* MOBILE SIDEBAR AND GLASS BACKDROP */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Glass backdrop: click anywhere outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 cursor-pointer bg-slate-900/25 backdrop-blur-md md:hidden"
            />

            {/* Mobile drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-[60] flex h-screen w-[min(310px,85vw)] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:hidden"
            >
              {renderSidebarContent(true, true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
