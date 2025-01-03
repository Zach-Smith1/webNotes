import React, { useState, useRef, useEffect } from "react";

const App = () => {
  const storedContent = localStorage.getItem("content");
  const storedHeader = localStorage.getItem("header");
  const storedTheme = localStorage.getItem("theme");
  const [content, setContent] = useState(storedContent ?? "Hello World");
  const [header, setHeader] = useState(storedHeader ?? "Your Notes Here");
  const [theme, setTheme] = useState(storedTheme ?? "light");
  const contentRef = useRef(null);
  const headerRef = useRef(null);

  const updateContent = (e, head) => {
    const newContent = e.currentTarget.textContent;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;

    // Update local storage directly without triggering a state update
    if (head) {
      localStorage.setItem("header", newContent);
    } else {
      localStorage.setItem("content", newContent);
    }

    // Manually restore the cursor position
    window.requestAnimationFrame(() => {
      head ? range.setStart(headerRef.current.childNodes[0], startOffset) : range.setStart(contentRef.current.childNodes[0], startOffset);
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

  useEffect(() => {
    // Apply the theme to the body element
    document.body.className = theme;
  }, [theme]);

  return (
    <div>
      <div className="checkbox-wrapper">
          <input
            checked={theme !== "light"}
            className="checkbox"
            id="checkbox"
            onChange={(e) => {
              setTheme(e.target.checked ? "dark" : "light");
              localStorage.setItem("theme", e.target.checked ? "dark" : "light");
            }}
            type="checkbox"
          />
          <label className="checkbox-label" htmlFor="checkbox">
            <i className="fas fa-moon"></i>
            <i className="fas fa-sun"></i>
            <span className="ball"></span>
          </label>
        </div>
      <h1
        contentEditable
        onInput={(e) => updateContent(e, 'head')}
        ref={headerRef}
        suppressContentEditableWarning
      >
        {header}
      </h1>
      <div
        className='allText'
        contentEditable
        onInput={(e) => updateContent(e)}
        ref={contentRef}
        suppressContentEditableWarning
      >
        {content}
      </div>
    </div>
  );
};

export default App;
