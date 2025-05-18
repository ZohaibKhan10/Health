
import { HTMLMotionProps, motion as framerMotion, Variant } from "framer-motion";

type MotionDivProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export const slideDown = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export const pulse = {
  initial: { scale: 1, opacity: 0.9 },
  animate: { scale: 1.05, opacity: 1, transition: { yoyo: Infinity, duration: 1.5 } }
};

export const breathe = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.9, 1, 0.9],
    transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
  }
};

export const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: { repeat: Infinity, duration: 5, ease: "easeInOut" }
  }
};

// Simple motion component wrapper with extended components
const motion = {
  div: ({ children, ...props }: MotionDivProps) => {
    return (
      <framerMotion.div {...props}>
        {children}
      </framerMotion.div>
    );
  },
  main: ({ children, ...props }: HTMLMotionProps<"main">) => {
    return (
      <framerMotion.main {...props}>
        {children}
      </framerMotion.main>
    );
  },
  h1: ({ children, ...props }: HTMLMotionProps<"h1">) => {
    return (
      <framerMotion.h1 {...props}>
        {children}
      </framerMotion.h1>
    );
  },
  h2: ({ children, ...props }: HTMLMotionProps<"h2">) => {
    return (
      <framerMotion.h2 {...props}>
        {children}
      </framerMotion.h2>
    );
  },
  span: ({ children, ...props }: HTMLMotionProps<"span">) => {
    return (
      <framerMotion.span {...props}>
        {children}
      </framerMotion.span>
    );
  },
  p: ({ children, ...props }: HTMLMotionProps<"p">) => {
    return (
      <framerMotion.p {...props}>
        {children}
      </framerMotion.p>
    );
  },
  button: ({ children, ...props }: HTMLMotionProps<"button">) => {
    return (
      <framerMotion.button {...props}>
        {children}
      </framerMotion.button>
    );
  },
  ul: ({ children, ...props }: HTMLMotionProps<"ul">) => {
    return (
      <framerMotion.ul {...props}>
        {children}
      </framerMotion.ul>
    );
  },
  li: ({ children, ...props }: HTMLMotionProps<"li">) => {
    return (
      <framerMotion.li {...props}>
        {children}
      </framerMotion.li>
    );
  }
};

export { motion };
