import Icon, {
  HomeOutlined,
  DeleteOutlined,
  FormOutlined,
  UploadOutlined,
  PlusOutlined,
  CloseOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  DragOutlined,
  PlusCircleOutlined,
  SyncOutlined,
  SearchOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
  CaretRightOutlined,
  UserOutlined,
  MinusCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  RadiusSettingOutlined,
  FolderOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  InsertRowLeftOutlined,
  ProjectOutlined,
  SnippetsOutlined,
  SafetyOutlined,
  ProductOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  CloudDownloadOutlined,
  SettingOutlined,
  CheckOutlined,
  HolderOutlined,
  TrademarkCircleOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  ApiOutlined,
  RadarChartOutlined,
  MessageOutlined,
  StarOutlined,
  StarFilled,
  MailOutlined,
  FieldTimeOutlined,
  ThunderboltOutlined,
  LikeOutlined,
  NotificationOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components'
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

const icons = {
  home: HomeOutlined,
  HomeOutlined,
  DeleteOutlined,
  delete: DeleteOutlined,
  FormOutlined,
  edit: FormOutlined,
  UploadOutlined,
  upload: UploadOutlined,
  PlusOutlined,
  add: PlusOutlined,
  CloseOutlined,
  close: CloseOutlined,
  CopyOutlined,
  copy: CopyOutlined,
  DragOutlined,
  drag: DragOutlined,
  more: EllipsisOutlined,
  SyncOutlined,
  sync: SyncOutlined,
  SearchOutlined,
  search: SearchOutlined,
  BarsOutlined,
  bars: BarsOutlined,
  MessageOutlined,
  messages: MessageOutlined,
  LeftOutlined,
  left: LeftOutlined,
  RightOutlined,
  right: RightOutlined,
  CaretRightOutlined,
  caret: CaretRightOutlined,
  UserOutlined,
  user: UserOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  RadiusSettingOutlined,
  LoadingOutlined,
  loading: LoadingOutlined,
  InfoCircleOutlined: InfoCircleOutlined,
  info: InfoCircleOutlined,
  ReloadOutlined,
  reload: ReloadOutlined,
  FolderOutlined,
  folder: FolderOutlined,
  AppstoreOutlined,
  app: AppstoreOutlined,
  SettingOutlined,
  setting: SettingOutlined,
  CheckOutlined,
  check: CheckOutlined,
  FileTextOutlined,
  InsertRowLeftOutlined,
  ProjectOutlined,
  SnippetsOutlined,
  SafetyOutlined,
  ProductOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  CloudDownloadOutlined,
  download: CloudDownloadOutlined,
  holder: HolderOutlined,
  TrademarkCircleOutlined,
  Video: VideoCameraOutlined,
  Image: PictureOutlined,
  Album: FileImageOutlined,
  Text: FontSizeOutlined,
  LinkOutlined,
  ApiOutlined,
  Api: ApiOutlined,
  spider: RadarChartOutlined,
  unstar: StarOutlined,
  stared: StarFilled,
  notify: MailOutlined,
  history: FieldTimeOutlined,
  thunder: ThunderboltOutlined,
  like: LikeOutlined,
  NotificationOutlined,
  System,
  At,
  Comment,
  Thumb,
  fanju,
  movie,
  video,
  anime,
  image,
  novel,
  posts,
  music,
  zixun,
  foods,
  person,
  life,
  comic,
  pixiv,
  voice,
  expression,
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
export default function Acon({ icon, size = 24, color, spin = false, rotate, title, hidden, onClick, ...props }) {
  const Image = icons[icon]
  if (Image && !hidden) {
    return <Wrap style={{ fontSize: size, ...props.style }} {...(browser.getPlatformType() === 'pc' ? { onClick: onClick } : { onTouchEnd: onClick })} >
      <Image spin={spin} style={{ color: color, transform: `rotate(${rotate || 0})` }} />{title && <span style={{ fontSize: size / 2 }}>{title}</span>}
    </Wrap>
  }
  return null;
}