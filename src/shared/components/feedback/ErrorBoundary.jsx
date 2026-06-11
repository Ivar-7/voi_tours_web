import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
            fontFamily: "sans-serif",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: "1.25rem" }}>
            Something went wrong
          </p>
          <pre
            style={{
              fontSize: "0.75rem",
              background: "#fef2f2",
              color: "#b91c1c",
              padding: "1rem",
              borderRadius: "0.5rem",
              maxWidth: "40rem",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {String(this.state.error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#d97706",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
