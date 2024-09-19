import { useEffect, useRef } from 'react';

const useScrollLock = (isLocked: boolean) => {
    const scrollPosition = useRef<number>(0);

    useEffect(() => {
        if (isLocked) {
            // Save the current scroll position
            scrollPosition.current = window.scrollY;

            // Lock body scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition.current}px`;
            document.body.style.width = '100%';
        } else {
            // Restore the scroll position
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';

            window.scrollTo(0, scrollPosition.current);
        }

        // Clean up on component unmount or if lock status changes
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isLocked]);
};

export default useScrollLock;
