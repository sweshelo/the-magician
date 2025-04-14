import { useInterceptUsage } from "@/hooks/intercept-usage";
import { ProgressConfirmButton } from "./ProgressConfirmButton";

export const InterceptSelectionOverlay = () => {
  const { availableIntercepts, interceptTimeLimit, cancelInterceptSelection } =
    useInterceptUsage();

  if (availableIntercepts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
      <div className="pointer-events-auto bg-slate-600/60 w-full py-8 rounded-md flex flex-col items-center justify-center">
        <p className="py-2">入力受付中</p>
        <ProgressConfirmButton
          timeLimit={interceptTimeLimit || undefined}
          buttonText="キャンセル"
          onConfirm={cancelInterceptSelection}
          onTimeExpire={cancelInterceptSelection}
          className="flex items-center justify-center"
        />
      </div>
    </div>
  );
};
