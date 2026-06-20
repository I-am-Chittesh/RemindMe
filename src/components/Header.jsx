import useTheme from "../hooks/useTheme";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
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

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="px-4 pt-6 pb-2">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}
          </h1>
          <p className="text-xs text-apple-gray mt-1">{getDate()}</p>
        </div>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 flex items-center justify-center text-lg transition-colors hover:bg-white/50 dark:hover:bg-white/10"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-apple-lg px-4 py-3 flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Tasks today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pending}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">remaining</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {completed}
            <span className="text-sm font-normal"> / {total}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;