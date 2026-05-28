import useTheme from "../hooks/useTheme";
import { usePWAInstall } from "../hooks/usePWAInstall";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning 👋";
  if (hour < 17) return "Good afternoon 👋";
  return "Good evening 👋";
};

const getDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const Header = ({ tasks }) => {
  const { theme, toggleTheme } = useTheme();
  const { canInstall, promptInstall } = usePWAInstall();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="px-4 pt-6 pb-2">
      {/* top row */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}
          </h1>
          <p className="text-sm text-apple-gray mt-0.5">{getDate()}</p>
        </div>

        {/* install & theme toggle */}
        <div className="flex gap-2">
          {canInstall && (
            <button
              onClick={promptInstall}
              className="w-9 h-9 rounded-full bg-white dark:bg-apple-darkcard border border-gray-200 dark:border-apple-darkborder flex items-center justify-center text-lg shadow-apple hover:bg-gray-50 dark:hover:bg-apple-darkcardHover transition-colors"
              title="Install app"
            >
              ⬇️
            </button>
          )}
          {/* theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-white dark:bg-apple-darkcard border border-gray-200 dark:border-apple-darkborder flex items-center justify-center text-lg shadow-apple hover:bg-gray-50 dark:hover:bg-apple-darkcardHover transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* summary bar */}
      <div className="bg-apple-blue rounded-apple-lg px-4 py-3 flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-blue-200">Tasks today</p>
          <p className="text-2xl font-bold text-white">{pending}</p>
          <p className="text-xs text-blue-200">remaining</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-200">Completed</p>
          <p className="text-2xl font-bold text-white">
            {completed}
            <span className="text-sm font-normal"> / {total}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;