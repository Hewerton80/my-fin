import { AlertModalProps } from "@/components/ui/overlay/AlertModal";
import { create } from "zustand";

export const ALERT_INITIAL_VALUES: AlertArgs = {
  title: "",
  description: "",
  variant: "default",
  confirmButtonText: "Ok",
  cancelButtonText: "Cancel",
  showCancelButton: false,
  isAsync: false,
};

export interface AlertArgs
  extends Omit<
    AlertModalProps,
    "id" | "children" | "className" | "show" | "isSubmiting"
  > {
  isAsync?: boolean;
}

interface State {
  show: boolean;
  alertModalValues: AlertArgs;
  isSubmiting: boolean;
}

interface Actions {
  closeAlert: () => void;
  setShow: (value: boolean) => void;
  setAlertModalValues: (values: AlertArgs) => void;
}

export const useAlertModalStore = create<State & Actions>((set) => ({
  isSubmiting: false,
  show: false,
  alertModalValues: ALERT_INITIAL_VALUES,
  setShow: (value: boolean) => {
    set(() => ({ show: value }));
  },
  setAlertModalValues: (values: AlertArgs) => {
    set(() => ({ alertModalValues: values }));
  },
  closeAlert: () => {
    set(() => ({
      show: false,
      isSubmiting: false,
      alertModalValues: ALERT_INITIAL_VALUES,
    }));
  },
}));
