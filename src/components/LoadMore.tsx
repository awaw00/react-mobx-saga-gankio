import * as React from 'react';
import { css } from 'react-emotion';

interface Props {
  loading: boolean;
  onLoadMore: () => any;
  hasMore: boolean;
  threshold?: number;
}

export default class LoadMore extends React.Component<Props, {}> {
  static defaultProps = {
    threshold: 10
  };

  ref: HTMLDivElement;
  willUnMount = false;

  componentWillUnmount () {
    this.willUnMount = true;
  }
  componentDidMount () {
    this.check();
  }

  check = () => {
    if (this.willUnMount) {
      this.ref = null;
      return;
    }

    const {loading, threshold, onLoadMore} = this.props;
    if (loading) {
      requestAnimationFrame(this.check);
      return;
    }

    const elRect = this.ref.getBoundingClientRect();
    const viewPortWidth = window.screen.width;
    const viewPortHeight = window.screen.height;

    let visible = true;
    let newPlacement = [];

    if (elRect.bottom < -threshold) {
      newPlacement.push('above');
    }
    if (elRect.top > viewPortHeight + threshold) {
      newPlacement.push('under');
    }
    if (elRect.left > viewPortWidth + threshold) {
      newPlacement.push('right');
    }
    if (elRect.right < -threshold) {
      newPlacement.push('left');
    }

    if (newPlacement.length > 0) {
      visible = false;
    }

    if (visible) {
      onLoadMore();
    }

    requestAnimationFrame(this.check);
  }
  render () {
    const {hasMore} = this.props;
    if (!hasMore) {
      return null;
    }
    return (
      <div ref={ref => this.ref = ref} className={css`text-align: center; margin-top: 10px;`}>
        Loading...
      </div>
    );
  }
}
