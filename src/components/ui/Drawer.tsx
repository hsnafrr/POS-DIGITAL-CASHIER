import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'w-96',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const slideVariants = {
    hidden: {
      x: position === 'right' ? 400 : -400,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed ${position === 'right' ? 'right-0' : 'left-0'} top-0 bottom-0 ${width} z-50 shadow-xl flex flex-col`}
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 30%, #FFF7ED 100%)',
            }}
          >
            <div className="flex items-center justify-between p-6 border-b border-surface-200/50"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))' }}
            >
              <h2 className="text-xl font-bold text-surface-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100/80 rounded-xl transition-colors"
                aria-label="Close drawer"
              >
                <X size={20} className="text-surface-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
