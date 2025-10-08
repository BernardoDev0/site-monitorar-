import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  logoSrc?: string;
}

export const Logo = ({ 
  className = "", 
  showText = true, 
  size = "md", 
  variant = "dark",
  logoSrc = "/moni2.png"
}: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12", 
    lg: "h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };

  const subtitleSizeClasses = {
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-base"
  };

  const textColorClasses = variant === "dark" 
    ? "text-primary" 
    : "text-white";

  const subtitleColorClasses = variant === "dark"
    ? "text-muted-foreground"
    : "opacity-90";

  return (
    <Link to="/" className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={logoSrc} 
        alt="Monitorar Consultoria Logo" 
        className={`${sizeClasses[size]} w-auto object-contain`}
        style={{ maxHeight: size === "sm" ? "32px" : size === "md" ? "48px" : "64px" }}
      />
      {showText && (
        <div>
        </div>
      )}
    </Link>
  );
};
