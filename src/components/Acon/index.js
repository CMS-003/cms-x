import Icon from '@ant-design/icons'
import { browser } from '@/utils';

import { ReactComponent as svgSystem } from '@/theme/icon/system.svg'
import { ReactComponent as svgAt } from '@/theme/icon/at.svg'
import { ReactComponent as svgComment } from '@/theme/icon/comment.svg'
import { ReactComponent as svgThumb } from '@/theme/icon/thumb.svg'
import { ReactComponent as svgExpression } from '@/theme/icon/expression.svg'
import { ReactComponent as svgVoice } from '@/theme/icon/voice.svg'

import { ReactComponent as fanjuSVG } from '@/theme/channel/fanju.svg'
import { ReactComponent as movieSVG } from '@/theme/channel/movie.svg'
import { ReactComponent as animeSVG } from '@/theme/channel/video.svg'
import { ReactComponent as imageSVG } from '@/theme/channel/image.svg'
import { ReactComponent as novelSVG } from '@/theme/channel/novel.svg'
import { ReactComponent as videoSVG } from '@/theme/channel/video.svg'
import { ReactComponent as postsSVG } from '@/theme/channel/posts.svg'
import { ReactComponent as musicSVG } from '@/theme/channel/music.svg'
import { ReactComponent as zixunSVG } from '@/theme/channel/news.svg'
import { ReactComponent as foodsSVG } from '@/theme/channel/foods.svg'
import { ReactComponent as comicSVG } from '@/theme/channel/comic.svg'
import { ReactComponent as lifeSVG } from '@/theme/channel/life.svg'
import { ReactComponent as personSVG } from '@/theme/channel/person.svg'
import { ReactComponent as pixivSVG } from '@/theme/channel/pixiv.svg'

import {
  Upload,
  Copy,
  X,
  User,
  Loader,
  Plus,
  Check,
  CopyMinus,
  ChevronRight,
  ChevronLeft,
  Move,
  MoveLeft,
  MoveRight,
  Settings,
  CirclePlus,
  CircleCheck,
  CircleAlert,
  CircleX,
  Music,
  FolderKanban,
  Trash,
  Trash2,
  FileSearch,
  RefreshCcw,
  RefreshCw,
  TriangleAlert,
  Cable,
  MonitorCog,
  CircleQuestionMark,
  LucideProps,
  ChartLine,
  FolderCog,
  ScanLine,
  CalendarSync,
  Book,
  SquareLibrary,
  Download,
  Bug,
  ImagePlay,
  Video,
  Image,
  Album,
  Captions,
  Puzzle,
  Database,
  Group,
  LayoutList,
  Component,
  List,
  Link,
  LayoutTemplate,
  FileClock,
  CalendarRange,
  ShieldCheck,
  Edit,
  View,
  Eye,
  House,
  History,
  Bell,
  Mail,
  Menu,
  ThumbsUp,
  MessageCircleMore,
  Smile,
  Info,
  Star,
  LoaderPinwheel,
  Library,
} from 'lucide-react';
import styled from 'styled-components';

const Map = {
  Loader,
  RefreshCw,
  RefreshCcw,
  Upload,
  Download,
  Copy,
  Edit,
  X,
  Trash,
  Trash2,
  Bug,
  House,
  User,
  Settings,
  home: House,
  user: User,
  setting: Settings,
  thunder: LoaderPinwheel,
  bars: Library,
  star: Star,
  notify: Bell,
  history: CalendarRange,
  ScanLine,
  Link,
  Plus,

  Check,
  CopyMinus,
  ChevronLeft,
  ChevronRight,
  Move,
  MoveLeft,
  MoveRight,

  ThumbsUp,
  MessageCircleMore,
  Smile,
  Info,
  Star,

  CirclePlus,
  CircleCheck,
  CircleAlert,
  CircleX,
  Music,
  FolderKanban,
  FileSearch,
  TriangleAlert,
  Cable,
  MonitorCog,
  ChartLine,
  FolderCog,
  CalendarSync,
  Book,
  SquareLibrary,
  ImagePlay,
  Video,
  Image,
  Album,
  Captions,
  Puzzle,
  Database,
  Group,
  LayoutList,
  Component,
  List,
  LayoutTemplate,
  FileClock,
  CalendarRange,
  ShieldCheck,
  View,
  Eye,
  History,
  Bell,
  Mail,
  Menu,
}

const System = (props) => <Icon component={svgSystem} {...props} />;
const At = (props) => <Icon component={svgAt} {...props} />;
const Thumb = (props) => <Icon component={svgThumb} {...props} />;
const Comment = (props) => <Icon component={svgComment} {...props} />;
const expression = (props) => <Icon component={svgExpression} {...props} />;
const voice = (props) => <Icon component={svgVoice} {...props} />;
const fanju = (props) => <Icon component={fanjuSVG} {...props} />;
const movie = (props) => <Icon component={movieSVG} {...props} />;
const anime = (props) => <Icon component={animeSVG} {...props} />;
const image = (props) => <Icon component={imageSVG} {...props} />;
const novel = (props) => <Icon component={novelSVG} {...props} />;
const video = (props) => <Icon component={videoSVG} {...props} />;
const posts = (props) => <Icon component={postsSVG} {...props} />;
const music = (props) => <Icon component={musicSVG} {...props} />;
const zixun = (props) => <Icon component={zixunSVG} {...props} />;
const foods = (props) => <Icon component={foodsSVG} {...props} />;
const comic = (props) => <Icon component={comicSVG} {...props} />;
const life = (props) => <Icon component={lifeSVG} {...props} />;
const person = (props) => <Icon component={personSVG} {...props} />;
const pixiv = (props) => <Icon component={pixivSVG} {...props} />;

const Wrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: pointer;
    cursor:pointer;
  &:hover { 
    opacity: 0.7;
    color: var(--ant-primary-color-hover);
  }
`;
export default function Acon({ icon, size = 24, color, spin = false, rotate, title, hidden, onClick, ...props }) {
  const Icon = Map[icon] || CircleQuestionMark;
  if (!hidden) {
    return <Wrap style={{ ...props.style, color: color || 'white' }} {...(browser.getPlatformType() === 'pc' ? { onClick: onClick } : { onTouchEnd: onClick })} >
      <Icon name={icon} style={{ transform: `rotate(${props.rotate || 0})`, color: color || 'black' }} {...props} size={props.size || 18} /> {props.title}
    </Wrap>
  }
  return null;
}