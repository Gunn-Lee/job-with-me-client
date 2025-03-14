interface SuggestedTopicsProps {
  topics: string[];
  onSelectTopic: (topic: string) => void;
}

export default function SuggestedTopics({ topics, onSelectTopic }: SuggestedTopicsProps) {
  return (
    <div className="px-6 py-3 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-2">Suggested topics:</p>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}