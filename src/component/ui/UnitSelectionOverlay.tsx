import { ProgressConfirmButton } from './ProgressConfirmButton';
import { useUnitSelection } from '@/hooks/unit-selection';

export const UnitSelectionOverlay = () => {
  const { candidate, selectionMode, handleSelected, title, isCancelable } = useUnitSelection();

  // candidateがなければ非表示
  if (!candidate || candidate.length === 0) return null;

  // キャンセルボタンのテキスト
  const cancelText = selectionMode === 'block' ? 'ブロックしない' : 'キャンセル';

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <div className="pointer-events-auto bg-slate-600/60 w-full py-8 rounded-md flex flex-col items-center justify-center absolute bottom-40 left-1/2 -translate-x-1/2">
        <p className="py-2">{title ?? 'ユニットを選択してください'}</p>
        {isCancelable && (
          <ProgressConfirmButton
            timeLimit={6}
            buttonText={cancelText}
            onConfirm={() => handleSelected?.()}
            onTimeExpire={() => handleSelected?.()}
            className="flex items-center justify-center"
          />
        )}
      </div>
    </div>
  );
};
