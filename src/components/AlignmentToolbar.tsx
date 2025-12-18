import { motion, AnimatePresence } from 'framer-motion';
import { AlignHorizontalJustifyStart, AlignHorizontalJustifyEnd, AlignHorizontalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, AlignVerticalJustifyCenter, AlignHorizontalSpaceAround, AlignVerticalSpaceAround } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import toast from 'react-hot-toast';

export const AlignmentToolbar = () => {
    const { selectedObjectIds, alignObjects, distributeObjects } = usePlayStore();

    if (!selectedObjectIds || selectedObjectIds.length < 2) return null;

    const handleAlign = (alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v') => {
        alignObjects(alignment);
        const alignmentNames = {
            'left': 'Left',
            'right': 'Right',
            'top': 'Top',
            'bottom': 'Bottom',
            'center-h': 'Center Horizontally',
            'center-v': 'Center Vertically',
        };
        toast.success(`Aligned ${alignmentNames[alignment]}`);
    };

    const handleDistribute = (direction: 'horizontal' | 'vertical') => {
        if (selectedObjectIds.length < 3) {
            toast.error('Select at least 3 objects to distribute');
            return;
        }
        distributeObjects(direction);
        toast.success(`Distributed ${direction === 'horizontal' ? 'Horizontally' : 'Vertically'}`);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 10 }}
                className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 glass-panel rounded-2xl p-3 shadow-2xl border border-white/10"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 px-2">
                        {selectedObjectIds.length} selected
                    </span>
                    <div className="h-6 w-px bg-white/10" />

                    {/* Alignment buttons */}
                    <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1">
                        <AlignButton
                            icon={<AlignHorizontalJustifyStart size={16} />}
                            label="Align Left"
                            onClick={() => handleAlign('left')}
                        />
                        <AlignButton
                            icon={<AlignHorizontalJustifyCenter size={16} />}
                            label="Align Center H"
                            onClick={() => handleAlign('center-h')}
                        />
                        <AlignButton
                            icon={<AlignHorizontalJustifyEnd size={16} />}
                            label="Align Right"
                            onClick={() => handleAlign('right')}
                        />
                    </div>

                    <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1">
                        <AlignButton
                            icon={<AlignVerticalJustifyStart size={16} />}
                            label="Align Top"
                            onClick={() => handleAlign('top')}
                        />
                        <AlignButton
                            icon={<AlignVerticalJustifyCenter size={16} />}
                            label="Align Center V"
                            onClick={() => handleAlign('center-v')}
                        />
                        <AlignButton
                            icon={<AlignVerticalJustifyEnd size={16} />}
                            label="Align Bottom"
                            onClick={() => handleAlign('bottom')}
                        />
                    </div>

                    {selectedObjectIds.length >= 3 && (
                        <>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1">
                                <AlignButton
                                    icon={<AlignHorizontalSpaceAround size={16} />}
                                    label="Distribute Horizontally"
                                    onClick={() => handleDistribute('horizontal')}
                                />
                                <AlignButton
                                    icon={<AlignVerticalSpaceAround size={16} />}
                                    label="Distribute Vertically"
                                    onClick={() => handleDistribute('vertical')}
                                />
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

const AlignButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        title={label}
    >
        {icon}
    </button>
);
