import { motion, MotionProps } from "motion/react";
// import { ImageProps } from "next/image";
export const RotateDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      animate={{
        rotate: 360
      }}
      whileHover={{
        rotate: -180
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {children}
    </motion.div>
  )
}
export const DefaultDiv = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const rand: boolean = Math.random() > 0.5;
  return (
    <motion.div
      className={className}
      whileHover={{
        rotate: rand ? +12 : -12,
        scale: 1.05,
      }}
    >
      {children}
    </motion.div>
  )
}
export const BoldDiv = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        textShadow: "0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)",
        scale: 1.05
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}
export const BababoiDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{
        scale: [1, 1.1, 0.9, 1.05, 0.95, 1.02, 0.98, 1]
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

type BoldButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps;

export const BoldButton = ({ children, ...rest }: BoldButtonProps) => {
  return (
    <motion.button
      {...rest} // 同时传递 button 原生属性和 motion 属性
      whileHover={{
        scale: 1.1,
        y: -5
      }}
      transition={{
        duration: 0,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.button>
  );
};

// export interface MotionCardProps extends ImageProps {
//   children: React.ReactNode;
//   focusable?: boolean;
//   active?: boolean;
//   onClick?: () => void;
//   className?: string;
// }

// export function ShowcaseDiv({

// }: MotionCardProps) {
//   return (
    
//   );
// }