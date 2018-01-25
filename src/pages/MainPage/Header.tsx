import * as React from 'react';
import styled from 'react-emotion';
import { GankType } from '../../constants';

interface Props {
  currentType: GankType;
  onShowMenuClick: () => any;
}

const HeaderWrapper = styled<any, 'div'>('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  font-size: 14px;
  padding: 10px 20px;
  line-height: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0094ff;
  color: #fff;
  
  > * {
    &, &:visited, &:active {
      color: inherit;
      text-decoration: none;
    }
    
    &:first-child, &:last-child {
      flex-basis: 20%;
    }
    &:last-child {
      text-align: right;
    }
  }
`;

class Header extends React.Component<Props, {}> {
  render () {
    const {currentType, onShowMenuClick} = this.props;
    return (
      <HeaderWrapper>
        <a href="http://gank.io" target="_blank">Gank.io</a>
        <span>{currentType}</span>
        <span onClick={onShowMenuClick}>菜单</span>
      </HeaderWrapper>
    );
  }
}

export default Header;
