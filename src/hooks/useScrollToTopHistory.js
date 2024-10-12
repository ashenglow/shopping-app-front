import { useCallback } from "react";
import { useHistory } from "react-router-dom"
export const useScrollToTopHistory = () => {
const history = useHistory();

const navigateAndScrollToTop = useCallback((path) => {
    history.push(path);
    window.scrollTo(0, 0);
}, [history]);

return navigateAndScrollToTop
}