import React, { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  className?: string;
}

const TagInput = ({ tags, setTags, placeholder, className }: TagInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      setTags([...tags, input.trim()]);
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  return (
    <div
      className={`flex flex-wrap items-center rounded-lg border p-2 focus-within:border-primary ${className}`}
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="m-1 flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-grow border-none bg-transparent p-1 focus:outline-none"
      />
    </div>
  );
};

export { TagInput };
