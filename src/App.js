import React, { useState, useRef, useEffect } from "react";

const App = () => {
  const storedContent = localStorage.getItem("content");
  const [content, setContent] = useState(storedContent ?? "Hello World");
  const contentRef = useRef(null);

  const updateContent = (e) => {
    const newContent = e.currentTarget.textContent;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;

    // Update local storage directly without triggering a state update
    localStorage.setItem("content", newContent);

    // Manually restore the cursor position
    window.requestAnimationFrame(() => {
      range.setStart(contentRef.current.childNodes[0], startOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  };

  useEffect(() => {
    // Ensure the content is initialized in the editable div
    if (contentRef.current) {
      contentRef.current.textContent = content;
    }
  }, [content]);

  return (
    <div>
      <h1>Your Notes Here</h1>
      <div
        contentEditable={true}
        onInput={(e) => updateContent(e)}
        ref={contentRef}
        suppressContentEditableWarning={true}
      >
        {content}
      </div>
    </div>
  );
};

export default App;
