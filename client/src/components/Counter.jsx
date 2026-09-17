import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Counter({ value, suffix = "" }) {
  const numberRef = useRef();

  useEffect(() => {
    const obj = { val: 0 };

    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power3.out",
      onUpdate: () => {
        numberRef.current.textContent =
          Math.floor(obj.val) + suffix;
      },
    });
  }, [value, suffix]);

  return (
    <span
      ref={numberRef}
      className="text-5xl font-medium md:text-7xl"
    >
      0{suffix}
    </span>
  );
}

export default Counter;