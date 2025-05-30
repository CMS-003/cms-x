import Icon, {
  HomeOutlined,
  DeleteOutlined,
  FormOutlined,
  UploadOutlined,
  PlusOutlined,
  CloseOutlined,
  CopyOutlined,
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
} from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components'
import { browser } from '@/utils';

import { ReactComponent as svgSystem } from '@/theme/icon/system.svg'
import { ReactComponent as svgAt } from '@/theme/icon/at.svg'
import { ReactComponent as svgComment } from '@/theme/icon/comment.svg'
import { ReactComponent as svgThumb } from '@/theme/icon/thumb.svg'

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
  fanju: fanjuSVG,
  movie: movieSVG,
  video: videoSVG,
  anime: animeSVG,
  image: imageSVG,
  novel: novelSVG,
  posts: postsSVG,
  music: musicSVG,
  zixun: zixunSVG,
  foods: foodsSVG,
  person: personSVG,
  life: lifeSVG,
  comic: comicSVG,
  pixiv: pixivSVG,
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
export default function Acon({ icon, size = 24, color, rotate, title, hidden, onClick, ...props }) {
  const Image = icons[icon]
  if (Image && !hidden) {
    return <Wrap style={{ fontSize: size, ...props.style }} {...(browser.getPlatformType() === 'pc' ? { onClick: onClick } : { onTouchEnd: onClick })} >
      <Image style={{ color: color, transform: `rotate(${rotate || 0})` }} />{title && <span style={{ fontSize: size / 2 }}>{title}</span>}
    </Wrap>
  }
  return null;
}