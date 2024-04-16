import { useEffect, useRef } from 'react';
import type  { MutableRefObject } from 'react';

/**
 * `usePrevious` returns a mutable ref object's `.current` property which is initialized to the passed argument `(value)` and
 *  immediately returned before updates from the current render.
 *
 * `usePrevious` is useful to store the previous prop or state value passed in as input.
 *
 * @function usePrevious
 * @returns {MutableRefObject.current} a mutable ref object's `.current` property.
*/

function usePrevious<T>(value: T): MutableRefObject<T | undefined>['current'] {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export default usePrevious;