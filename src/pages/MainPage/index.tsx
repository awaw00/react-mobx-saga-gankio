import * as React from 'react';
import { inject, observer } from 'mobx-react';
import GankUIStore from '../../stores/GankUIStore';
import { GankType } from '../../constants';
import DrawerMenu from './DrawerMenu';
import Header from './Header';
import Content from './Content';

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

        <Header currentType={gank.currentType} onShowMenuClick={() => gank.switchMenuShow(true)}/>

        <DrawerMenu
          title="Gank 干货集中营"
          show={gank.showMenu}
          menuItems={menuItems}
          currentMenuKey={gank.currentType}
          onMenuClick={gankType => gank.switchGankType(gankType)}
          onClose={() => gank.switchMenuShow(false)}
        />

        <Content currentType={gank.currentType} data={gank.data} onLoadMore={gank.loadNextPage} loading={gank.loading}/>

      </div>
    );
  }
}
