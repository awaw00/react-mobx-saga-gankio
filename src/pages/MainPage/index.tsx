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

        <ul>
          {gank.data.map(i => {
            return <li key={i._id}>{i.desc}</li>;
          })}
        </ul>

        <button onClick={() => gank.switchMenuShow(!gank.showMenu)}>Switch Menu</button>
        <button onClick={gank.loadNextPage}>Load Next Page</button>
      </div>
    );
  }
}
