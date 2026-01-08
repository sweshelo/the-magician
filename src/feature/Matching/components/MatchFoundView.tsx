'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/component/interface/button';

interface MatchFoundViewProps {
  roomId: string;
  opponent: {
    id: string;
    name: string;
    rating?: number;
  };
}

export function MatchFoundView({ roomId, opponent }: MatchFoundViewProps) {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/room/${roomId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [roomId, router]);

  const handleJoinNow = () => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-12 max-w-lg w-full mx-4 shadow-2xl border-2 border-purple-500/50"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-green-500">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white text-center mb-8"
        >
          マッチング成立！
        </motion.h2>

        {/* Opponent Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-700/50 rounded-xl p-6 mb-8 border border-slate-600"
        >
          <p className="text-gray-300 text-center text-sm mb-2">対戦相手</p>
          <p className="text-2xl font-bold text-white text-center mb-1">{opponent.name}</p>
          {opponent.rating && (
            <p className="text-sm text-gray-400 text-center">レート: {opponent.rating}</p>
          )}
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/30 border-2 border-purple-500 mb-3">
            <span className="text-3xl font-bold text-purple-300">{countdown}</span>
          </div>
          <p className="text-gray-400">秒後に自動で入室します...</p>
        </motion.div>

        {/* Join Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleJoinNow}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all"
          >
            今すぐ入室する
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
