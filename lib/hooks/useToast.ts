import { getErrorMsg } from "../utils";
import { useStore } from "../store/store";

export interface UseToast {
  error: (msg: any, disableTheme?: boolean) => void;
  success: (msg: string, disableTheme?: boolean) => void;
}
export function useToast(): UseToast {
  const { update } = useStore();
  const error = (msg: any, disableTheme?: boolean) => {
    update(({ toasts }) => ({
      toasts: [{ type: "error", msg }].concat(toasts || []),
    }));
  };
  const success = (msg: string, disableTheme?: boolean) => {
    update(({ toasts }) => ({
      toasts: [{ type: "success", msg }].concat(toasts || []),
    }));
  };
  return { error, success };
}
