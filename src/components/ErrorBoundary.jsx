import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "60vh", padding: 40,
          fontFamily: "var(--font-mono, monospace)", color: "var(--text-primary, #fff)",
        }}>
          <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{
            background: "var(--bg-secondary, #1a1a2e)", padding: 16,
            borderRadius: 8, maxWidth: 600, overflow: "auto", fontSize: 13,
          }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
          >
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
