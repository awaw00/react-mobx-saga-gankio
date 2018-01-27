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
  handleMenuClick = (gankType: GankType) => {
    this.props.gank.switchGankType(gankType);
  }
  handleMenuShow = () => {
    this.props.gank.switchMenuShow(true);
  }
  handleMenuClose = () => {
    this.props.gank.switchMenuShow(false);
  }
  render () {
    const {gank} = this.props;

    return (
      <div>

        <Header currentType={gank.currentType} onShowMenuClick={this.handleMenuShow}/>

        <DrawerMenu
          title="Gank 干货集中营"
          show={gank.showMenu}
          menuItems={menuItems}
          currentMenuKey={gank.currentType}
          onMenuClick={this.handleMenuClick}
          onClose={this.handleMenuClose}
        />

        <Content currentType={gank.currentType} data={gank.data} onLoadMore={gank.loadNextPage} loading={gank.loading}/>

      </div>
    );
  }
}
