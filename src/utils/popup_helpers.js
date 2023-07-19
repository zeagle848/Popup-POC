import { createPopper } from '@popperjs/core';
import { TOOLTIP_CONTENT } from '../constants/tooltip_content';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

export function createPage({ parent }) {
  const positions = ['right', 'right-start', 'right-end', 'top', 'top-start', 'top-end', 'bottom', 'left'];
  const ids = ['top-icon', 'left-icon', 'right-icon', 'bottom-icon', 'bottom-start-icon'];

  ids.forEach((id) =>
    appendPopUpToElement({ element: document.getElementById(id), placement: id.replace('-icon', '') })
  );
  positions.forEach((position) => createParagraph({ parent, placement: position }));
}

export function closePopups({ target }) {
  const popups = document.querySelectorAll('[data-show]');
  const removePopup =
    target.closest('.tooltip') ||
    target.classList.contains('icon') ||
    target.classList.contains('popup-button') ||
    popups.length === 0;

  if (removePopup) {
    return;
  }
  popups.forEach((p) => p.removeAttribute('data-show'));
}

function createParagraph({ parent, placement }) {
  const subheader = document.createElement('h3');
  subheader.textContent = placement;
  parent.appendChild(subheader);

  const detailsContainer = document.createElement('details');

  const summary = document.createElement('summary');
  summary.classList.add('summary-text');
  summary.textContent = 'Example text';
  detailsContainer.appendChild(summary);

  const paragraph = document.createElement('p');
  paragraph.textContent = lorem.generateParagraphs(9);
  detailsContainer.appendChild(paragraph);

  const popUpButton = document.createElement('button');
  popUpButton.textContent = '\u24d8';
  popUpButton.id = `button-number`;
  popUpButton.classList.add('popup-button');

  subheader.appendChild(popUpButton);

  appendPopUpToElement({ element: popUpButton, placement });
  parent.appendChild(detailsContainer);
}

function addContentToTooltip({ tooltip }) {
  TOOLTIP_CONTENT.forEach((lineitem) => {
    const mainText = document.createElement('div');
    mainText.textContent = lineitem[1];

    const boldText = document.createElement('strong');
    boldText.textContent = lineitem[0];

    mainText.insertAdjacentElement('afterbegin', boldText);
    tooltip.appendChild(mainText);
  });
}

function appendPopUpToElement({ element, placement }) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.setAttribute('role', 'tooltip');

  addContentToTooltip({ tooltip });

  const arrow = document.createElement('div');
  arrow.classList.add('arrow');

  tooltip.appendChild(arrow);
  element.parentNode.append(tooltip);

  /* 
  We can also add the data-popper-arrow attribute to the arrow element but this isn't as explicit, especially
  when we're manipulating the DOM through vanilla JS 
  */
  const popperInstance = createPopper(element, tooltip, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrow,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  function handleButtonClick() {
    const isTooltipVisible = tooltip.getAttribute('data-show') === 'true';

    if (isTooltipVisible) {
      tooltip.removeAttribute('data-show');
    } else {
      tooltip.setAttribute('data-show', 'true');
      popperInstance.update();
    }
  }
  element.addEventListener('click', handleButtonClick);
}
