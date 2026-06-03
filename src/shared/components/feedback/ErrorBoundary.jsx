// TODO: Implement ErrorBoundary
// Class component; catches render errors; renders <ErrorHandler /> as fallback
// Props: fallback (optional custom fallback), children

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    return this.props.children;
  }
}
