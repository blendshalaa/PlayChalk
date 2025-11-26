import { X } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';

export const WelcomeTutorial = () => {
    const { setShowWelcome } = usePlayStore();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl font-bold">Welcome to PlayChalk! 🏀</h2>
                        <button
                            onClick={() => setShowWelcome(false)}
                            className="p-2 rounded-lg hover:bg-white/20 transition-all"
                        >
                            <X size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                    <p className="text-orange-100 text-lg">
                        Design and animate basketball plays in seconds
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Step 1 */}
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                                1
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Add Players</h3>
                            <p className="text-gray-600 text-sm">
                                Drag offense (O), defense (X), or ball from the sidebar onto the court
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                                2
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Position & Label</h3>
                            <p className="text-gray-600 text-sm">
                                Double-click players to edit labels (1, PG, etc.). Drag to position them
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                                3
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Add Frames</h3>
                            <p className="text-gray-600 text-sm">
                                Click "Add Frame" and move players to create animation keyframes
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                                4
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Draw & Animate</h3>
                            <p className="text-gray-600 text-sm">
                                Use line/arrow tools to show movement. Click Play to see your animation!
                            </p>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">⚡</span> Quick Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="font-bold">•</span>
                                <span><strong>Keyboard Shortcuts:</strong> S (Select), L (Line), A (Arrow), Ctrl+Z (Undo)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold">•</span>
                                <span><strong>Delete:</strong> Select object and press Delete or click "Delete Selected"</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold">•</span>
                                <span><strong>Save:</strong> Click "Save Play" in header to save your work</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold">•</span>
                                <span><strong>Customize:</strong> Change colors and thickness when drawing lines/arrows</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => setShowWelcome(false)}
                        className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition-all shadow-lg hover:scale-105"
                    >
                        Get Started →
                    </button>
                </div>
            </div>
        </div>
    );
};
