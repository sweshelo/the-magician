'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export type ChoiceOption = {
  id: string;
  label: string;
  enabled: boolean;
  // 任意でラベルや追加情報を拡張可
  // labelTop?: string;
};

type ChoicePanelState = {
  options: ChoiceOption[] | null;
  selectedId: string | null;
  remainTime: number | null; // 秒（小数点2桁）
  deadline: number | null; // Date.now() + 残りms
  player: string | null; // 選択権を持つプレイヤーID
  title: string | null; // ボタン上部ラベル
  promptId: string | null; // 選択肢プロンプトID
};

type ChoicePanelContextType = {
  state: ChoicePanelState;
  setOptions: (
    opts: ChoiceOption[],
    timeLimitSec: number,
    player: string,
    title: string,
    promptId: string
  ) => void;
  clear: () => void;
  select: (id: string) => void;
  tick: () => void;
  setOnSelectCallback: (cb: (id: string | null) => void) => void;
};

const ChoicePanelContext = createContext<ChoicePanelContextType | undefined>(undefined);

export const useChoicePanel = () => {
  const ctx = useContext(ChoicePanelContext);
  if (!ctx) throw new Error('useChoicePanel must be used within ChoicePanelProvider');
  return ctx;
};

export const ChoicePanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChoicePanelState>({
    options: null,
    selectedId: null,
    remainTime: null,
    deadline: null,
    player: null,
    title: null,
    promptId: null,
  });

  // タイマー管理
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 選択時コールバック
  const onSelectCallbackRef = useRef<((id: string | null) => void) | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const tick = useCallback(() => {
    setState(prev => {
      if (!prev.deadline) return prev;
      const remain = Math.max(0, prev.deadline - Date.now());
      const remainSec = remain / 1000;
      if (remain <= 0) {
        clearTimer();
        return { ...prev, remainTime: 0 };
      }
      return { ...prev, remainTime: remainSec };
    });
  }, []);

  const setOptions = (
    opts: ChoiceOption[],
    timeLimitSec: number,
    player: string,
    title: string,
    promptId: string
  ) => {
    clearTimer();
    const deadline = Date.now() + timeLimitSec * 1000;
    setState({
      options: opts,
      selectedId: null,
      remainTime: timeLimitSec,
      deadline,
      player,
      title,
      promptId,
    });
    timerRef.current = setInterval(tick, 30);
  };

  const clear = () => {
    console.log('clear');
    clearTimer();
    // onSelectCallbackRef.currentは呼ばず、ただnullクリア
    onSelectCallbackRef.current = null;
    setState({
      options: null,
      selectedId: null,
      remainTime: null,
      deadline: null,
      player: null,
      title: null,
      promptId: null,
    });
  };

  const select = (id: string) => {
    clearTimer();
    setState(prev => ({
      ...prev,
      selectedId: id,
    }));
    if (onSelectCallbackRef.current) {
      onSelectCallbackRef.current(id);
      onSelectCallbackRef.current = null;
    }
  };

  // クリーンアップ
  React.useEffect(() => {
    return () => clearTimer();
  }, []);

  // 選択時コールバックをセット
  const setOnSelectCallback = (cb: (id: string | null) => void) => {
    onSelectCallbackRef.current = cb;
  };

  return (
    <ChoicePanelContext.Provider
      value={{ state, setOptions, clear, select, tick, setOnSelectCallback }}
    >
      {children}
    </ChoicePanelContext.Provider>
  );
};
