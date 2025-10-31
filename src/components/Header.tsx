import { Button } from '@/components/ui/button';
import { Sparkles, User, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  user?: { email: string } | null;
  onSignOut?: () => void;
}

const Header = ({ onMenuClick, showMenuButton = false, user, onSignOut }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 animate-fade-in">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden mr-2 transition-all duration-200 hover:scale-110"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 blur-md bg-primary/30 animate-pulse-glow" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-300% transition-all duration-300 group-hover:scale-105">
              OnyxGPT
            </h1>
          </div>
          <span className="hidden sm:inline text-xs text-muted-foreground ml-2 animate-fade-in">
            500+ AI Models
          </span>
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 transition-all duration-200 hover:scale-105">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-scale-in">
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="gap-2 transition-all duration-200 hover:scale-105">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Guest Mode</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
