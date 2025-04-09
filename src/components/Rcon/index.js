import React from 'react';
import {
  IoIosSync,
  IoIosPlay,
  IoIosPause,
  IoIosHeadset,
  IoMdMusicalNote,
  IoIosVolumeLow,
  IoIosVolumeOff,
  IoIosClose,
  IoMdClose,
} from 'react-icons/io';
import {
  FaHome,
  FaTasks,
  FaUserAlt,
  FaRedo,
  FaStar,
  FaAngleRight,
  FaAngleLeft,
  FaRegCheckCircle,
  FaRegCircle,
  FaRegTrashAlt,
  FaEllipsisH,
  FaPause,
  FaHistory,
  FaImages,
  FaListAlt,
  FaEllipsisV,
  FaCircle,
  FaFileAlt,
  FaPlay,
  FaTrashAlt,
  FaPlus,
  FaLock,
  FaArrowsAlt,
  FaCaretDown,
  FaCaretRight,
  FaSyncAlt,
  FaChevronLeft,
  FaMinusCircle,
  FaPlusCircle,
  FaBatteryHalf,
  FaCog,
  FaSortNumericDown,
  FaSortNumericUp,
  FaCloudDownloadAlt,
  FaQrcode,
  FaListUl,
  FaHeart,
  FaPlayCircle,
} from 'react-icons/fa';
import {
  MdRepeatOne,
  MdShuffle,
  MdTrendingFlat,
  MdApps,
  MdRepeat,
  MdSkipNext,
} from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';

const IOicons = {
  IoIosSync,
  IoIosPlay,
  IoIosPause,
  IoIosHeadset,
  IoMdMusicalNote,
  IoIosVolumeLow,
  IoIosVolumeOff,
  IoLoader: FiLoader,
  IoIosClose,
  IoMdClose,
};
const Faicons = {
  FaHome,
  FaTasks,
  FaUserAlt,
  FaCircle,
  FaRedo,
  FaQrcode,
  FaCloudDownloadAlt,
  FaStar,
  FaAngleRight,
  FaEllipsisV,
  FaRegCheckCircle,
  FaRegCircle,
  FaRegTrashAlt,
  FaImages,
  FaListAlt,
  FaAngleLeft,
  FaEllipsisH,
  FaHistory,
  FaFileAlt,
  FaPause,
  FaPlay,
  FaTrashAlt,
  FaPlus,
  FaLock,
  FaArrowsAlt,
  FaCaretDown,
  FaCaretRight,
  FaSyncAlt,
  FaChevronLeft,
  FaMinusCircle,
  FaPlusCircle,
  FaBatteryHalf,
  FaCog,
  FaSortNumericDown,
  FaSortNumericUp,
  FaListUl,
  FaHeart,
  FaPlayCircle,
};
const Mdicons = {
  MdRepeatOne,
  MdShuffle,
  MdTrendingFlat,
  MdRepeat,
  MdApps,
  MdSkipNext,
};
// https://react-icons.netlify.com/#/icons/fa

// const types = {
//   home: require('./home.svg'),
//   user: require('./user.svg'),
//   map: require('./map.svg'),
//   fire: require('./fire.svg'),
//   search: require('./search.svg'),
//   setting: require('./setting.svg'),
// };

// export default function ({ type, className = '', size = 'md', ...restProps }) {
//   return (<svg className={`am-icon am-icon-${type.substr(1)} am-icon-${size} ${className}`} {...restProps}>
//     <use xlinkHref={require('./home.svg')} />
//   </svg>)
// }

export default function Rcon({
  type,
  className = '',
  inline = false,
  size = 'sm',
  style = {},
  after = '',
  before = '',
  color = '',
  spin,
  ...restProps
}) {
  const Icon = type.startsWith('Fa')
    ? Faicons[type]
    : type.startsWith('Md')
      ? Mdicons[type]
      : IOicons[type];
  return (
    <div
      style={{
        display: inline ? 'inline-block' : 'flex',
        fontSize: size === 'md' ? '1.5rem' : size === 'bg' ? '2rem' : '1.1rem',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      className={`${className}`}
      {...restProps}
    >
      {before}
      <Icon className={spin ? 'spin' : ''} style={{ margin: '0 4px', color }} />
      {after}
    </div>
  );
}
