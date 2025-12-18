import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
    tags: string[];
    availableTags: string[];
    onChange: (tags: string[]) => void;
    onAddCustomTag: (tag: string) => void;
    placeholder?: string;
}

export const TagInput = ({ tags, availableTags, onChange, onAddCustomTag, placeholder = 'Add tags...' }: TagInputProps) => {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredSuggestions = availableTags.filter(
        tag => !tags.includes(tag) && tag.toLowerCase().includes(input.toLowerCase())
    );

    const handleAddTag = (tag: string) => {
        if (tag.trim() && !tags.includes(tag.trim())) {
            onChange([...tags, tag.trim()]);
            if (!availableTags.includes(tag.trim())) {
                onAddCustomTag(tag.trim());
            }
            setInput('');
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            handleAddTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={inputRef}>
            <div className="flex flex-wrap gap-2 p-3 bg-black/20 border border-white/10 rounded-xl min-h-[44px]">
                <AnimatePresence mode="popLayout">
                    {tags.map((tag) => (
                        <motion.div
                            key={tag}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold"
                        >
                            <span>{tag}</span>
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-orange-500/30 rounded p-0.5 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                />
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-full bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        {filteredSuggestions.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleAddTag(tag)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
