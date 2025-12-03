import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import { motion, AnimatePresence } from 'framer-motion';

export const KeyboardShortcutsPanel = () => {
    const { showShortcuts, toggleShortcuts } = usePlayStore();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === '?' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
                e.preventDefault();
                toggleShortcuts();
            }
            if (e.key === 'Escape' && showShortcuts) {
                toggleShortcuts();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showShortcuts, toggleShortcuts]);

    const shortcuts = [
        {
            category: 'Tools',
            items: [
                { keys: ['S'], description: 'Select & Move tool' },
                { keys: ['L'], description: 'Draw Line tool' },
                { keys: ['A'], description: 'Draw Arrow tool' },
                { keys: ['F'], description: 'Freehand tool' },
                { keys: ['T'], description: 'Add Text tool' },
                { keys: ['E'], description: 'Eraser tool' },
            ],
        },
        {
            category: 'Actions',
            items: [
                { keys: ['Ctrl', 'C'], description: 'Copy selected object' },
                { keys: ['Ctrl', 'V'], description: 'Paste object' },
                { keys: ['Ctrl', 'Z'], description: 'Undo' },
                { keys: ['Ctrl', 'Y'], description: 'Redo' },
                { keys: ['Delete'], description: 'Delete selected object' },
                { keys: ['Backspace'], description: 'Delete selected object' },
            ],
        },
        {
            category: 'Ball',
            items: [
                { keys: ['D'], description: 'Detach ball from player' },
            ],
        },
        {
            category: 'Help',
            items: [
                { keys: ['?'], description: 'Toggle this shortcuts panel' },
                { keys: ['Esc'], description: 'Close shortcuts panel' },
            ],
        },
    ];

    return (
        <AnimatePresence>
            {showShortcuts && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleShortcuts}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="glass-panel rounded-3xl p-8 max-w-2xl w-full pointer-events-auto max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                        <Command className="text-orange-500" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                                        <p className="text-sm text-gray-400">Learn the shortcuts to work faster</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleShortcuts}
                                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Shortcuts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {shortcuts.map((section) => (
                                    <div key={section.category}>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                            {section.category}
                                        </h3>
                                        <div className="space-y-2">
                                            {section.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                                >
                                                    <span className="text-sm text-gray-300">{item.description}</span>
                                                    <div className="flex items-center gap-1">
                                                        {item.keys.map((key, keyIndex) => (
                                                            <React.Fragment key={keyIndex}>
                                                                <kbd className="px-2 py-1 text-xs font-bold bg-black/40 border border-white/20 rounded text-white min-w-[28px] text-center">
                                                                    {key}
                                                                </kbd>
                                                                {keyIndex < item.keys.length - 1 && (
                                                                    <span className="text-gray-500 text-xs">+</span>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 text-center">
                                    Press <kbd className="px-1.5 py-0.5 bg-black/40 border border-white/20 rounded text-white">?</kbd> anytime to toggle this panel
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
