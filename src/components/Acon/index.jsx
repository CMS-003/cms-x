import Icon from '@ant-design/icons'
import { browser } from '@/utils';

import svgSystem from '@/theme/icon/system.svg?react'
import svgAt from '@/theme/icon/at.svg?react'
import svgComment from '@/theme/icon/comment.svg?react'
import svgThumb from '@/theme/icon/thumb.svg?react'
import svgExpression from '@/theme/icon/expression.svg?react'
import svgVoice from '@/theme/icon/voice.svg?react'
import svgVideoBroken from '@/theme/icon/video-broken.svg?react'

import fanjuSVG from '@/theme/channel/fanju.svg?react'
import movieSVG from '@/theme/channel/movie.svg?react'
import animeSVG from '@/theme/channel/video.svg?react'
import imageSVG from '@/theme/channel/image.svg?react'
import novelSVG from '@/theme/channel/novel.svg?react'
import videoSVG from '@/theme/channel/video.svg?react'
import postsSVG from '@/theme/channel/posts.svg?react'
import musicSVG from '@/theme/channel/music.svg?react'
import zixunSVG from '@/theme/channel/news.svg?react'
import foodsSVG from '@/theme/channel/foods.svg?react'
import comicSVG from '@/theme/channel/comic.svg?react'
import lifeSVG from '@/theme/channel/life.svg?react'
import personSVG from '@/theme/channel/person.svg?react'
import pixivSVG from '@/theme/channel/pixiv.svg?react'

import {
  Upload,
  Copy,
  X,
  UserRound,
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
  AtSign,
  Heart,
  Smile,
  Info,
  Star,
  LoaderPinwheel,
  Library,
  VideoOff,
} from 'lucide-react';
import styled from 'styled-components';

const System = (props) => <Icon component={svgSystem} {...props} />;
const At = (props) => <Icon component={svgAt} {...props} />;
const Thumb = (props) => <Icon component={svgThumb} {...props} />;
const Comment = (props) => <Icon component={svgComment} {...props} />;
const expression = (props) => <Icon component={svgExpression} {...props} />;
const voice = (props) => <Icon component={svgVoice} {...props} style={{ width: 50, height: 50 }} />;
const videoBroken = (props) => <Icon component={svgVideoBroken} {...props} />;
const fanju = (props) => <Icon component={fanjuSVG} style={{ fontSize: 50 }}>{props.children}</Icon>;
const movie = (props) => <Icon component={movieSVG} style={{ fontSize: 50 }}>{props.children}</Icon>;
const anime = (props) => <Icon component={animeSVG} style={{ fontSize: 50 }} />;
const image = (props) => <Icon component={imageSVG} style={{ fontSize: 50 }} />;
const novel = (props) => <Icon component={novelSVG} style={{ fontSize: 50 }} />;
const video = (props) => <Icon component={videoSVG} style={{ fontSize: 50 }} />;
const posts = (props) => <Icon component={postsSVG} style={{ fontSize: 50 }} />;
const music = (props) => <Icon component={musicSVG} style={{ fontSize: 50 }} />;
const zixun = (props) => <Icon component={zixunSVG} style={{ fontSize: 50 }} />;
const foods = (props) => <Icon component={foodsSVG} style={{ fontSize: 50 }} />;
const comic = (props) => <Icon component={comicSVG} style={{ fontSize: 50 }} />;
const life = (props) => <Icon component={lifeSVG} style={{ fontSize: 50 }} />;
const person = (props) => <Icon component={personSVG} style={{ fontSize: 50 }} />;
const pixiv = (props) => <Icon component={pixivSVG} style={{ fontSize: 50 }} />;

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
  User: UserRound,
  Settings,
  home: House,
  user: UserRound,
  setting: Settings,
  thunder: LoaderPinwheel,
  bars: Library,
  Star: Star,
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
  Comment: MessageCircleMore,
  At: AtSign,
  Heart,
  Smile,
  Info,

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
  VideoOff,
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

  fanju,
  movie,
  anime,
  image,
  novel,
  video,
  posts,
  music,
  zixun,
  foods,
  comic,
  life,
  person,
  pixiv,
  videoBroken,
}

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
export default function Acon({ icon, size = 24, color, fill, spin = false, rotate, title, hidden, onPointerDown, ...props }) {
  const Icon = Map[icon] || CircleQuestionMark;
  if (!hidden) {
    return <Wrap style={{ color: color || 'white', ...props.outerStyle }} onPointerDown={onPointerDown} >
      <Icon name={icon} style={{ transform: `rotate(${props.rotate || 0})`, color: color || 'black', fill: fill, ...props.innerStyle }} size={size} />
      {title}
    </Wrap>
  }
  return null;
}