import './style.css';
import { closePopups, createPage } from './utils/popup_helpers';

function main() {
  const paragraphElement = document.getElementById('paragraph-wrapper');

  createPage({ parent: paragraphElement });

  window.addEventListener('click', closePopups);
}

main();
