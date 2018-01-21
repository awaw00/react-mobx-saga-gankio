import * as React from 'react';
import styled from 'react-emotion';

interface MenuItem<T> {
  key: T;
  text: string;
}

interface Props<T = any> {
  title: string;
  show: boolean;
  menuItems: MenuItem<T>[];
  currentMenuKey: T;
  onClose?: () => any;
  onMenuClick?: (key: T) => any;
}

const Wrapper = styled<{show: boolean}, 'div'>('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: ${props => !props.show && 'none'};
`;

const Title = styled('h1')`
  color: #fff;
  font-size: 20px;
  padding: 0 12px;
`;

const DrawerMask = styled<{show: boolean}, 'div'>('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #222222;
  transition: opacity .2s ease-out;
  z-index: 1000;
  opacity: ${props => props.show ? '.5' : '0'};
`;

const DrawerBody = styled<{show: boolean}, 'div'>('div')`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 200px;
  background-color: #0094ff;
  transition: transform .1s ease-out;
  transform: translateX(${(props) => props.show ? '0' : '-100%'});
  z-index: 1001;
`;

const DrawerList = styled('ul')`
  padding: 0;
  margin: 0;
  margin-top: 20px;
  width: 100%;
`;

const DrawerItem = styled<{active?: boolean}, 'li'>('li')`
  background-color: ${props => props.active ? '#fff' : 'transparent'};
  color: ${props => props.active ? '#0094ff' : '#fff'};
  cursor: pointer;
  padding: 12px;
`;

export default class DrawerMenu extends React.Component<Props, {}> {
  render () {
    const {title, show, currentMenuKey, menuItems, onClose, onMenuClick} = this.props;
    return (
      <Wrapper show={show}>
        <DrawerBody show={show}>
          <Title>{title}</Title>

          <DrawerList>
            {menuItems.map(i => {
              const {key, text} = i;
              return (
                <DrawerItem
                  key={key}
                  active={key === currentMenuKey}
                  onClick={() => onMenuClick(key)}
                >
                  {text}
                </DrawerItem>
              );
            })}
          </DrawerList>
        </DrawerBody>

        <DrawerMask show={show} onClick={onClose}/>
      </Wrapper>
    );
  }
}
