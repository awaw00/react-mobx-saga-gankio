import * as React from 'react';
import { inject, observer } from 'mobx-react';
import GankUIStore from '../../stores/GankUIStore';
import { GankType } from '../../constants';
import DrawerMenu from './DrawerMenu';

interface Props {
  gank?: GankUIStore;
}

const menuItems = Object.keys(GankType).map(i => ({
  key: GankType[i],
  text: GankType[i]
}));

@inject('gank')
@observer
export default class MainPage extends React.Component<Props, {}> {
  render () {
    const {gank} = this.props;

    return (
      <div>

        <DrawerMenu
          title="Gank 干货集中营"
          show={gank.showMenu}
          menuItems={menuItems}
          currentMenuKey={gank.currentType}
          onMenuClick={gankType => gank.switchGankType(gankType)}
          onClose={() => gank.switchMenuShow(false)}
        />

        <button onClick={() => gank.switchMenuShow(!gank.showMenu)}>Switch Menu</button>
      </div>
    );
  }
}
