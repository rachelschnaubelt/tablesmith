const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
}

const returnFocusToId = (id: string | null) => {
    if (id) {
        const focusElement = document.querySelector(`#${id}`);
        if (focusElement && focusElement instanceof HTMLElement) {
            focusElement.focus();
        }
    }
}

export {
    blurActiveElement,
    returnFocusToId
}