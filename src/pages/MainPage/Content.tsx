import * as React from 'react';
import styled from 'react-emotion';
import { GankType } from '../../constants';
import { GankDataItem } from '../../types';
import LoadMore from '../../components/LoadMore';

interface ItemProps {
  data: GankDataItem;
}

const ItemWrapper = styled('div')`
  margin-top: 12px;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  padding: 6px;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    border-color: rgba(0, 0, 0, 0.09);
  }
`;

const WelfareImg = styled('img')`
  display: block;
  max-width: 100%;
  margin: 0 auto;
`;

const CommonContent = styled('div')`
  display: flex;
  align-items: flex-start;
`;

const CommonImg = styled<{bgImg: string}, 'div'>('div')`
  flex: none;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background-image: url(${props => props.bgImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const CommonTitle = styled('div')`
  flex: 1 1 auto;
`;

const Info = styled('div')`
  font-size: 10px;
  color: #8e8e8e;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
`;

class Item extends React.PureComponent<ItemProps, {}> {
  render () {
    const {data} = this.props;
    return (
      <ItemWrapper onClick={() => window.open(data.url)}>
        {
          data.type === GankType.Welfare
            ? (
              <WelfareImg src={data.url + '?imageView2/0/w/375'}/>
            ) : (
              <CommonContent>
                {data.images && data.images.length > 0 && <CommonImg bgImg={data.images[0] + '?imageView2/0/w/100'}/>}
                <CommonTitle>{data.desc}</CommonTitle>
              </CommonContent>
            )
        }

        <Info>
          <div>
            {data.type} by: {data.who}
          </div>
          <div>
            {data.createdAt.replace(/^(.*?)T(.*?)\.(.*)$/g, '$1 $2')}
          </div>
        </Info>
      </ItemWrapper>
    );
  }
}

interface Props {
  currentType: GankType;
  data: GankDataItem[];
  onLoadMore: () => any;
  loading: boolean;
}

const ContentWrapper = styled('div')`
  padding: 34px 10px 10px 10px;
`;

export default class Content extends React.PureComponent<Props, {}> {
  render () {
    const {currentType, data, onLoadMore, loading} = this.props;
    return (
      <ContentWrapper>
        {data.map(i => {
          return (
            <Item key={i._id} data={i}/>
          );
        })}

        <LoadMore loading={loading} onLoadMore={onLoadMore} hasMore={true}/>
      </ContentWrapper>
    );
  }
}
