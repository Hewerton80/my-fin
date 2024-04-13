import { ToastContainer } from "react-toastify";
import style from "./Toast.module.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export function Toast() {
  return (
    <ToastContainer
      className={style.root}
      icon={<FaRegCheckCircle size={56} className="text-white" />}
      closeButton={<FaTimes className="text-white" />}
      toastClassName="bg-red-500"
    />
  );
}
