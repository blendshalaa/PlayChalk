import { X, ArrowRight } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import { motion } from 'framer-motion';

export const WelcomeTutorial = () => {
    const { setShowWelcome } = usePlayStore();

    const steps = [
        {
            num: 1,
            title: "Add Players",
            desc: "Drag offense (O), defense (X), or ball from the sidebar onto the court.",
            color: "from-orange-400 to-orange-600"
        },
        {
            num: 2,
            title: "Position & Label",
            desc: "Double-click players to edit labels. Drag to position them freely.",
            color: "from-blue-400 to-blue-600"
        },
        {
            num: 3,
            title: "Add Frames",
            desc: "Click 'Add Frame' and move players to create smooth animations.",
            color: "from-purple-400 to-purple-600"
        },
        {
            num: 4,
            title: "Draw & Animate",
            desc: "Use line/arrow tools (including dashed for passes) to show movement. Click Play to watch it come alive!",
            color: "from-green-400 to-green-600"
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
            >
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[500px]">
                    {/* Left Side: Hero */}
                    <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between bg-white/5 border-r border-white/5">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                Play<span className="text-orange-500">Chalk</span>
                            </h1>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                The most advanced tool for designing basketball plays. Simple, powerful, and beautiful.
                            </p>
                        </div>

                        <div className="mt-8 md:mt-0">
                            <button
                                onClick={() => setShowWelcome(false)}
                                className="group w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                            >
                                Get Started
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Steps */}
                    <div className="w-full md:w-3/5 p-8 md:p-12 bg-black/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center font-bold text-white text-lg mb-4 shadow-lg`}>
                                        {step.num}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <p className="text-sm text-blue-200 text-center font-medium">
                                💡 <span className="font-bold text-white">Pro Tip:</span> Use keyboard shortcuts (S, L, A, P) to work faster!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setShowWelcome(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </motion.div>
        </div>
    );
};
