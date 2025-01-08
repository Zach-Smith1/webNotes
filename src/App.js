import React, { useState, useRef, useEffect } from "react";

const App = () => {
  const greeting = "Look no further for your minimalistic writing needs! This is a simple note-taking app that saves your notes in your browser's local storage.<br><br> You can start typing your notes here and they will be saved automatically! You can also switch between light and dark mode by toggling the switch at the top right corner.<br><br> This is a work in progress and more features will be added soon. For now, to start typing your notes click";
  const firstHeader = "Welcome to Web Notes!";
  const [firstRefresh, setFirstRefresh] = useState(false);
  const storedContent = localStorage.getItem("content");
  const storedHeader = localStorage.getItem("header");
  const storedTheme = localStorage.getItem("theme");
  const [content, setContent] = useState(storedContent ?? greeting);
  const [header, setHeader] = useState(storedHeader ?? firstHeader);
  const [theme, setTheme] = useState(storedTheme ?? "light");
  const contentRef = useRef(null);
  const headerRef = useRef(null);

  const handleKeyDown = (e) => {
    console.log(localStorage.getItem("content"));
    if (e.key === "Enter") {
      e.preventDefault();

      // Insert a new line (equivalent to pressing Enter)
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const br = document.createElement("br");
      const space = document.createTextNode("\u200B"); // Prevents cursor issues
      range.deleteContents();
      range.insertNode(br);
      range.collapse(false);
      range.insertNode(space);

      // Move cursor to the new line
      range.setStartAfter(space);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (e.key === "Tab") {
      e.preventDefault();

      // Insert spaces for a tab
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const tab = document.createTextNode("\u00a0\u00a0\u00a0\u00a0"); // 4 non-breaking spaces
      range.insertNode(tab);
      range.insertNode(tab);

      // Move cursor after the inserted tab
      range.setStartAfter(tab);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };


  const updateContent = (e, head = false) => {
    let here = document.getElementById("startWriting");
    if (here) {here.onclick = null;
    here.removeAttribute("id");}

    const newContent = e.currentTarget.innerHTML;

    // Save cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const node = range.startContainer;

    // Update local storage directly
    if (head) {
      localStorage.setItem("header", newContent);

    } else {
      localStorage.setItem("content", newContent);
    }

    // Restore cursor position after a small delay
    window.requestAnimationFrame(() => {
      if (contentRef.current && contentRef.current.contains(node)) {
        const restoredRange = document.createRange();
        restoredRange.setStart(node, Math.min(startOffset, node.length));
        restoredRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(restoredRange);
      }
    });
  };

  useEffect(() => {
    // Ensure the content is initialized in the editable div
    if (contentRef.current) {
      if (content === greeting) {
        contentRef.current.innerHTML = content;
        const span = document.createElement("span");
        span.id = "startWriting";
        span.innerText = " HERE";
        span.onclick = () => {
          setContent('');
          setHeader('Your Title Here');
        };
        contentRef.current.appendChild(span);
      } else {
        contentRef.current.innerHTML = content;
      }
    }
  }, [content]);

  useEffect(() => {
    // Apply the theme to the body element
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="App">
      <div className="toolBar">
          <div className="icon-wrapper">
            <i
              className={`fa-solid fa-rotate ${firstRefresh ? 'red' : ''}`}
              onClick={(e) => {
                if (firstRefresh) {
                  localStorage.removeItem("content");
                  localStorage.removeItem("header");
                  setContent(greeting);
                  setHeader(firstHeader);
                  setFirstRefresh(false);
                  e.target.style.transform = "rotate(0deg)";
                  window.location.reload();
                } else {
                setFirstRefresh(true);
                e.target.style.transition = "transform 0.5s";
                e.target.style.transform = "rotate(180deg)";
                setTimeout(() => {
                  e.target.style.transform = "rotate(0deg)";
                  setFirstRefresh(false);
                }, 5000);
              }}
            }
            ></i>
            <span className={!firstRefresh ? 'confirmed' : 'firstClick'}>&emsp;Are you sure you want to reset? Click again to confirm.</span>
          </div>
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
      </div>
      <h1
        contentEditable
        onKeyDown={handleKeyDown}
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
        onKeyDown={handleKeyDown}
        ref={contentRef}
        style={{ fontSize: "1.5rem" }}
        suppressContentEditableWarning
      >
        {content}
      </div>
    </div>
  );
};

export default App;
