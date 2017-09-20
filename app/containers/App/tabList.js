import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'
import { is } from 'immutable';
import { Tabs } from 'antd'
import { updateTabChecked, deleteTabFromList } from '../../actions/tabList'

const TabPane = Tabs.TabPane

@connect(
    (state, props) => ({ tabList: state.tabListResult , config: state.config,}),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch),
      dispatch: dispatch })
)
export default class TabList extends Component {
  //只有一个理由需要传递props作为super()的参数，那就是你需要在构造函数内使用this.props
  constructor(props) {
    super(props)
      //对事件方法的绑定 绑定到统一的事件监听器
      // ES6 必须手动绑定
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }
  componentDidMount() {
     console.log('this.props', this.props);
  }
  onChange(activeKey) {
    const { actions } = this.props;
    // 切换tab 标签
    this.props.dispatch(updateTabChecked({ activeKey: activeKey }))
      // 切换页面
     actions.push(activeKey)
  }
  onEdit(targetKey, action) {
    this[action](targetKey);
  }
  remove(targetKey) {
    const { actions, tabList } = this.props;
    let delIndex
    let activeKey

    if (targetKey === tabList.activeKey) {
      tabList.list.map((tab, index) => {
        tab.key === targetKey ? delIndex = index : null;
      });
      // eslint-disable-next-line no-nested-ternary
      activeKey = tabList.list[delIndex + 1] ?
        tabList.list[delIndex + 1].key : (tabList.list[delIndex - 1] ?
          tabList.list[delIndex - 1].key : '');
      actions.push(activeKey);
    }
     this.props.config.WEBDATA[targetKey].value = '';
    this.props.config.WEBDATA[targetKey].isclose = true;
    this.props.dispatch(deleteTabFromList({ targetKey: targetKey }));
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.tabList.activeKey) {
        this.props.config.WEBDATA[nextProps.tabList.activeKey].isclose = false
    }
    const thisProps = this.props || {};

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
      return true;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key in nextProps) {
      if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
        return true;
      }
    }
    return false;
  }
  render() {
    const { tabList } = this.props
    return (
      <Tabs
        hideAdd
        onChange={this.onChange}
        activeKey={tabList.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {
            tabList.list.map((tab) =>
            <TabPane tab={tab.title} key={tab.key}>{tab.content}</TabPane>)
        }
      </Tabs>
    )
  }
}
