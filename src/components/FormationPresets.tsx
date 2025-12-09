import React from 'react';
import { formationPresets } from '../data/presets';
import { usePlayStore } from '../store/usePlayStore';
import toast from 'react-hot-toast';

export const FormationPresets: React.FC = () => {
    const applyFormationPreset = usePlayStore((state) => state.applyFormationPreset);

    const offensePresets = formationPresets.filter(p => p.category === 'offense');
    const defensePresets = formationPresets.filter(p => p.category === 'defense');

    const handlePresetClick = (presetId: string, presetName: string) => {
        applyFormationPreset(presetId);
        toast.success(`Applied ${presetName} formation`);
    };

    return (
        <div className="space-y-4">
            {/* Offense Formations */}
            <div>
                <h3 className="text-xs font-bold text-orange-400 mb-2 uppercase tracking-wider">
                    Offense
                </h3>
                <div className="space-y-1">
                    {offensePresets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetClick(preset.id, preset.name)}
                            className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-orange-500/20 
                                     border border-white/10 hover:border-orange-500/50 transition-all duration-200
                                     group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white group-hover:text-orange-400 
                                                  transition-colors truncate">
                                        {preset.name}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                        {preset.description}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 
                                              flex items-center justify-center text-xs font-bold text-orange-400
                                              group-hover:bg-orange-500/30 transition-colors">
                                    {preset.objects.length}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Defense Formations */}
            <div>
                <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
                    Defense
                </h3>
                <div className="space-y-1">
                    {defensePresets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetClick(preset.id, preset.name)}
                            className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-blue-500/20 
                                     border border-white/10 hover:border-blue-500/50 transition-all duration-200
                                     group"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white group-hover:text-blue-400 
                                                  transition-colors truncate">
                                        {preset.name}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                        {preset.description}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 
                                              flex items-center justify-center text-xs font-bold text-blue-400
                                              group-hover:bg-blue-500/30 transition-colors">
                                    {preset.objects.length}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
