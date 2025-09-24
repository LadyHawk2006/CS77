
import { useEffect, RefObject } from 'react';

export function useChatScroll<T>(
  ref: RefObject<HTMLDivElement>,
  dependency: T,
  behavior: ScrollBehavior = 'smooth'
) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior,
      });
    }
  }, [dependency, ref, behavior]);
}
