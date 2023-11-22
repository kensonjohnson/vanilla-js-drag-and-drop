// Grab all the draggable elements and containers
const draggables =
  document.querySelectorAll<HTMLParagraphElement>(".draggable");
const containers = document.querySelectorAll<HTMLDivElement>(".container");

// Setup event listeners for draggable elements
draggables.forEach((draggable: HTMLParagraphElement) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

// Setup event listeners for containers
containers.forEach((container: HTMLDivElement) => {
  container.addEventListener("dragover", (event: DragEvent) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(container, event.clientY);
    const draggable = document.querySelector(".dragging");
    if (!draggable) return;
    if (!afterElement) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

// Get the element that the draggable element is currently over
function getDragAfterElement(container: HTMLDivElement, y: number) {
  const draggableElements = [
    ...container.querySelectorAll<HTMLParagraphElement>(
      ".draggable:not(.dragging)"
    ),
  ];

  // Find the closest element to the draggable element
  return draggableElements.reduce(
    (
      closest: { offset: number; element?: HTMLParagraphElement },
      child: HTMLParagraphElement
    ) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      // If the offset is negative and greater than the current closest offset,
      // return the current element as the closest element
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
