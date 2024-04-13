import { useCallback, useMemo } from "react";
import {
  AlertArgs,
  ALERT_INITIAL_VALUES,
  useAlertModalStore,
} from "@/stores/useAlertModalStore";
import { useShallow } from "zustand/react/shallow";

export function useAlertModal() {
  // const { showAlert, closeAlert } = useContext(AlertContext);
  const {
    alertModalValues,
    closeAlert,
    isSubmiting,
    setAlertModalValues,
    setShow,
    show,
  } = useAlertModalStore(useShallow((state) => state));
  // const [isSubmiting, setIsSubmiting] = useState(false);
  // const [show, setShow] = useState(false);
  const {
    onClose,
    onClickCancelButton,
    onClickConfirmButton,
    isAsync,
    ...restAlertModalValues
  } = useMemo(() => alertModalValues, [alertModalValues]);

  const showAlert = useCallback(
    (alertModalProps: AlertArgs) => {
      setShow(true);
      setAlertModalValues(alertModalProps);
    },
    [setAlertModalValues, setShow]
  );

  // const closeAlert = useCallback(() => {
  //   console.log("closeAlert");
  //   setShow(false);
  //   setIsSubmiting(false);
  //   setAlertModalValues(ALERT_INITIAL_VALUES);
  // }, [setAlertModalValues]);

  const handleCloseAlert = useCallback(() => {
    closeAlert();
    onClose?.();
  }, [closeAlert, onClose]);

  const handleClickCancelButton = useCallback(() => {
    handleCloseAlert();
    onClickCancelButton?.();
  }, [handleCloseAlert, onClickCancelButton]);

  const handleClickConfirmButton = useCallback(() => {
    if (isAsync) {
      useAlertModalStore.setState({ isSubmiting: true });
    } else {
      handleCloseAlert();
    }
    onClickConfirmButton?.();
  }, [isAsync, onClickConfirmButton, handleCloseAlert]);

  return {
    showAlert,
    closeAlert,
    alertArgs: {
      show,
      isSubmiting,
      onClose: handleCloseAlert,
      onClickCancelButton: handleClickCancelButton,
      onClickConfirmButton: handleClickConfirmButton,
      ...restAlertModalValues,
    },
  };
  // return { showAlert, closeAlert };
}
