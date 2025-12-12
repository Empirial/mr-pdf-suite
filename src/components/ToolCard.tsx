import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

const ToolCard = ({ title, description, icon, href, isActive = false }: ToolCardProps) => {
  return (
    <Link to={href}>
      <div className={`
        group relative p-6 rounded-lg border transition-all duration-300 cursor-pointer
        ${isActive 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border bg-card hover:border-primary/50 hover:shadow-md"
        }
      `}>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              {title}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        
        {isActive && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ToolCard;
