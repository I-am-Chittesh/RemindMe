const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "sup homie.";
  if (hour < 17) return "sup homie.";
  return "sup homie.";
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
    <div className="px-5 pt-8 pb-2">
      {/* greeting */}
      <div className="mb-6">
        <h1
          className="text-[28px] font-bold text-white tracking-tight"
          style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
        >
          {getGreeting()}
        </h1>
        <p className="text-[15px] text-apple-gray mt-0.5 font-normal">
          {getDate()}
        </p>
      </div>

      {/* summary bar — dark card, no blue */}
      <div
        className="rounded-apple-lg px-5 py-4 flex justify-between items-center mb-6"
        style={{
          background: "#2C2C2E",
          border: "0.5px solid #3A3A3C",
        }}
      >
        <div>
          <p className="text-[13px] text-apple-gray font-normal">Tasks today</p>
          <p
            className="text-[34px] font-bold text-white leading-none mt-1"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
          >
            {pending}
          </p>
          <p className="text-[13px] text-apple-gray mt-1">remaining</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-apple-gray font-normal">Completed</p>
          <p
            className="text-[34px] font-bold text-white leading-none mt-1"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
          >
            {completed}
            <span className="text-[17px] font-normal text-apple-gray"> / {total}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;