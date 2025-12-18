import { Bot } from '@/types/chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BotCardProps {
  bot: Bot;
  onClick?: () => void;
}

const BotCard = ({ bot, onClick }: BotCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/bot/${bot.uuid}`);
    }
  };

  const getVisibilityIcon = () => {
    switch (bot.visibility) {
      case 'private':
        return <Lock className="w-3 h-3" />;
      case 'unlisted':
        return <Eye className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 h-full flex flex-col"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          {bot.pfp_url ? (
            <img
              src={bot.pfp_url}
              alt={bot.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {bot.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs gap-1">
              {getVisibilityIcon()}
              {bot.visibility}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{bot.name}</CardTitle>
        {bot.category && (
          <Badge variant="secondary" className="w-fit text-xs">
            {bot.category}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <CardDescription className="line-clamp-3 mb-3">
          {bot.description || 'No description provided'}
        </CardDescription>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {bot.usage_count || 0} uses
          </span>
          <span className="text-xs">
            {new Date(bot.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotCard;
