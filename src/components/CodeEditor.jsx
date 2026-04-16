import { useState, useEffect, useRef } from "react";

function highlightOQL(code) {
  return code.split("\n").map((line, i) => {
    let html = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(/(#.*)$/, '<span class="syn-comment">$1</span>');
    html = html.replace(
      /("[^"]*"|'[^']*')/g,
      '<span class="syn-string">$1</span>'
    );
    html = html.replace(
      /\b(SCENARIO|DEVICE_TYPE|DEVICE_MODEL|MANUFACTURER|GOAL|SET|WAIT|SAVE|MIN|MAX|VAL|IF|ELSE|ERROR|PUMP|LOG|ASSERT_STATUS|ASSERT_JSON|ASSERT_SENSOR|ASSERT_VALVE|API_GET|EXPECT_DEVICE|EXPECT_I2C_BUS|EXPECT_I2C_CHIP|SHELL_EXPORT)\b/g,
      '<span class="syn-keyword">$1</span>'
    );
    html = html.replace(/→/g, '<span class="syn-arrow">→</span>');
    html = html.replace(
      /\b(\d+\.?\d*)\s*(ms|mbar|bar|l\/min|l|s)\b/g,
      '<span class="syn-number">$1</span><span class="syn-unit">$2</span>'
    );
    html = html.replace(
      /(?<!class=")\b(\d+\.?\d*)\b(?!["<])/g,
      '<span class="syn-number">$1</span>'
    );

    return `<span class="line-num">${String(i + 1).padStart(3)}</span>${html}`;
  });
}

function highlightIQL(code) {
  return code.split("\n").map((line, i) => {
    let html = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(/(#.*)$/, '<span class="syn-comment">$1</span>');
    html = html.replace(
      /("[^"]*")/g,
      '<span class="syn-string">$1</span>'
    );
    html = html.replace(
      /\b(SET|LOG|API|GET|POST|PUT|DELETE|ASSERT_STATUS|ASSERT_OK|ASSERT_CONTAINS|ASSERT_JSON|ASSERT_VISIBLE|ASSERT_TEXT|NAVIGATE|WAIT|CLICK|INPUT|SELECT_DEVICE|SELECT_INTERVAL|START_TEST|STEP_COMPLETE|RECORD_START|RECORD_STOP|REPLAY|INCLUDE|ENCODER_ON|ENCODER_OFF|ENCODER_CLICK|ENCODER_SCROLL|ENCODER_FOCUS)\b/g,
      '<span class="syn-keyword">$1</span>'
    );
    html = html.replace(
      /\$\{[^}]+\}/g,
      '<span class="syn-interp">$&</span>'
    );
    html = html.replace(
      /(?<!class=")\b(\d+\.?\d*)\b(?!["<])/g,
      '<span class="syn-number">$1</span>'
    );
    return `<span class="line-num">${String(i + 1).padStart(3)}</span>${html}`;
  });
}

export default function CodeEditor({ example, value, onChange }) {
  const [localCode, setLocalCode] = useState(value || example.code);
  const [highlighted, setHighlighted] = useState([]);
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  // Sync with external value when example changes and no external value provided
  useEffect(() => {
    if (value === undefined) {
      setLocalCode(example.code);
    }
  }, [example, value]);

  useEffect(() => {
    const fn = example.lang === "oql" ? highlightOQL : highlightIQL;
    setHighlighted(fn(code));
  }, [code, example.lang]);

  const handleScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleChange = (e) => {
    const newCode = e.target.value;
    setLocalCode(newCode);
    onChange?.(newCode);
  };

  // Use external value if provided, otherwise local state
  const code = value !== undefined ? value : localCode;

  return (
    <div className="editor-wrapper">
      <div className="editor-header">
        <span className="file-badge">{example.lang === "oql" ? "⚙ .oql" : "🧪 .iql / .tql"}</span>
        <span className="file-title">{example.title}</span>
      </div>
      <div className="editor-body">
        <pre
          ref={preRef}
          className="editor-highlight"
          dangerouslySetInnerHTML={{ __html: highlighted.join("\n") }}
        />
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={handleChange}
          onScroll={handleScroll}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
