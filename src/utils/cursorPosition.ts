const getCaretPosition = (element: HTMLElement): number => {
  let caretOffset = 0;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }
  return caretOffset;
};

const setCaretPosition = (element: HTMLElement, position: number): void => {
  const range = document.createRange();
  const selection = window.getSelection();

  if (selection) {
    selection.removeAllRanges();
  }

  if (element.childNodes.length === 0 || position === 0) {
    range.setStart(element, 0);
    range.collapse(true);
  } else {
    let currentPos = 0;
    let targetNode: Node | null = null;
    let targetOffset = 0;

    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (currentPos + textLength >= position) {
          targetNode = node;
          targetOffset = position - currentPos;
          break;
        }
        currentPos += textLength;
      }
    }

    if (targetNode) {
      range.setStart(targetNode, targetOffset);
    } else {
      const lastChild = element.childNodes[element.childNodes.length - 1];
      if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(lastChild, lastChild.textContent?.length || 0);
      }
    }

    range.collapse(true);
  }

  if (selection) {
    selection.addRange(range);
  }
};

export { getCaretPosition, setCaretPosition };