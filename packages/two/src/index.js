import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello webpack', 'This is app two'], '. ');

  return element;
}

document.body.appendChild(component());
