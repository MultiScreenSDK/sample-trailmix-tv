import poly from "babelify/polyfill";
import React from 'react';
import App from './js/App.jsx';

document.addEventListener("DOMContentLoaded", function(event) {
  React.render(<App params={window.location.search.substring(1)} />, document.body);
});
