import React from 'react';

class BuggyComponent extends React.Component {
  componentDidMount() {
    // Intentionally throw an error
    throw new Error("This is a test error!");
  }

  render() {
    return <div>Buggy Component</div>;
  }
}

export default BuggyComponent;
