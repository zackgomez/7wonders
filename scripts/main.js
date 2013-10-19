/** @jsx React.DOM */

var GameDisplay = React.createClass({
  render: function() {
    return <div>hello world</div>;
  },
});

React.renderComponent(
  <GameDisplay />,
  document.getElementById('root')
);
