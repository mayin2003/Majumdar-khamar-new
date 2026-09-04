import { Variants } from 'framer-motion';

// Page transition variant (300ms ease-out)
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Section / Container Stagger Animation
export const containerStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05
    }
  }
};

// Scroll Reveal Card Item (fade in + translate up 20px)
export const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut'
    }
  }
};

// Hover micro-interactions presets
export const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.15 }
};

export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 }
};

export const cardHover = {
  y: -4,
  transition: { duration: 0.2, ease: 'easeOut' }
};
