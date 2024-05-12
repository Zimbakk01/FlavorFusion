/**
 * CustomButton Component:
 * Represents a customizable button component.
 * Accepts props for title, containerStyles, iconRight, type, and onClick event handler.
 * Renders a button with the specified title, styles, and optional icon.
 *
 * @param {string} title - The text content of the button.
 * @param {string} containerStyles - CSS classes/styles to apply to the button container.
 * @param {ReactNode} iconRight - Optional icon to render on the right side of the button text.
 * @param {string} type - The type of button (e.g., "button", "submit", "reset").
 * @param {Function} onClick - Event handler function to be called when the button is clicked.
 * @returns {JSX.Element} The JSX element representing the custom button.
 */
const CustomButton = ({ title, containerStyles, iconRight, type, onClick }) => {
    return (
        <button
            onClick={onClick}
            type={type || "button"}
            className={`inline-flex items-center text-base ${containerStyles}`}
        >
            {title}

            {iconRight && <div className='ml-2'>{iconRight}</div>}
        </button>
    );
};

export default CustomButton;