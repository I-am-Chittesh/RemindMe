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
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="px-4 pt-6 pb-2">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}
          </h1>
          <p className="text-sm text-apple-gray mt-0.5">{getDate()}</p>
        </div>
      </div>

      <div className="bg-apple-darkcard rounded-apple-lg px-4 py-3 flex justify-between items-center mb-6 border border-apple-darkborder">
        <div>
          <p className="text-xs text-apple-gray">Tasks today</p>
          <p className="text-2xl font-bold text-white">{pending}</p>
          <p className="text-xs text-apple-gray">remaining</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-apple-gray">Completed</p>
          <p className="text-2xl font-bold text-white">
            {completed}
            <span className="text-sm font-normal text-apple-gray"> / {total}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;