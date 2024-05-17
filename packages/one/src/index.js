import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello webpack', 'This is the first app', 'It should be bigger than the second'], '. ');

  return element;
}

document.body.appendChild(component());
