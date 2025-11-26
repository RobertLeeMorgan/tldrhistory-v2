import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import { ToastContainer } from "react-toastify";

export default function RootLayout() {
  return (
    <>
      <Nav />
      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        theme="dark"
      />
    </>
  );
}
