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
          <p
            style={{
              fontSize: "0.875rem",
              color: "#71717a",
              maxWidth: "28rem",
              textAlign: "center",
            }}
          >
            We hit an unexpected error. Please reload the page — if this keeps
            happening, contact support.
          </p>
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
