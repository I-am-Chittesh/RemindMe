import { useEffect } from "react";

const useTheme = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("remindme-theme", "dark");
  }, []);
};

export default useTheme;