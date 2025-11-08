
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TriggerBar = ({ triggers, metadata, rawContent }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedTrigger, setSelectedTrigger] = useState(null);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
        setSelectedTrigger(null);
    };

    const handleTriggerClick = (trigger) => {
        if (selectedTrigger && selectedTrigger.trigger === trigger.trigger) {
            setSelectedTrigger(null);
        } else {
            setSelectedTrigger(trigger);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-800 text-white">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Triggers</h3>
                <button onClick={toggleExpansion} className="px-4 py-2 bg-blue-500 rounded-md">
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4">
                            <div className="flex gap-2">
                                {triggers.map((trigger) => (
                                    <button
                                        key={trigger.trigger}
                                        onClick={() => handleTriggerClick(trigger)}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedTrigger?.trigger === trigger.trigger ? 'bg-blue-600' : 'bg-gray-600'
                                        }`}
                                    >
                                        {trigger.trigger}
                                    </button>
                                ))}
                            </div>
                            {selectedTrigger && (
                                <div className="mt-4 p-4 bg-gray-700 rounded-md">
                                    <h4 className="font-bold">{selectedTrigger.trigger}</h4>
                                    <p className="mt-2 text-sm">{selectedTrigger.system_instruction}</p>
                                    <div className="mt-4">
                                        <h5 className="font-bold">Context</h5>
                                        <pre className="mt-2 p-2 bg-gray-800 rounded-md text-xs">
                                            {JSON.stringify(metadata[selectedTrigger.trigger], null, 2)}
                                        </pre>
                                    </div>
                                    <div className="mt-4">
                                        <h5 className="font-bold">Raw Content</h5>
                                        <pre className="mt-2 p-2 bg-gray-800 rounded-md text-xs">
                                            {rawContent}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TriggerBar;
