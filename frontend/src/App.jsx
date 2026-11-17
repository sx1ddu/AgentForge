import { useEffect } from "react";
import Home from "./pages/Home";
import { getCurrentUser } from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch(setUserData(user));
        }
      } catch (err) {
        console.error("App init getCurrentUser error:", err);
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <>
      <Home />
    </>
  );
};

export default App;
