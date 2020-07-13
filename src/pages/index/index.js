import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Bills from '../bills';
import Withdraw from '../withdraw';
import Assessment from '../assessment';
import ImageManagement from '../imageManagement';
import HeaderCom from '../../components/headerCom';
import LeftNavMenu from '../../components/leftMenus';
import './index.css';

export default class Index extends Component{
	constructor(props){
        super(props);
		this.state = {
			path: props.location.pathname,
			leftMenuList: [
				{
					path: '/index/bills',
					title: '维修订单',
				},
				{
					path: '/index/assessment',
					title: '测评订单',
				},
				{
					path: '/index/withdraw',
					title: '提现管理',
				},
				{
					path: '/index/imageManagement',
					title: '二手图片管理',
				},
			]
		}
    }
	
	componentWillReceiveProps(nextProps) {
	    if (nextProps.location.pathname !== this.props.location.pathname) {
			this.listenRouteChange(nextProps.location.pathname)
	    } 
	}
	
	listenRouteChange(pathname){
		this.setState({
			path: pathname
		})
	}
	
    render(){
        return(
            <div className="index_box">
				<HeaderCom history ={this.props.history}/>
				<div className="flex_box content_pneal">
					<LeftNavMenu
						path={this.state.path}
						leftMenuList={this.state.leftMenuList}></LeftNavMenu>
					<div className="right_content">
						<Switch>
							<Route path='/index/bills' component={Bills} />
							<Route path='/index/withdraw' component={Withdraw} />
							<Route path='/index/assessment' component={Assessment} />
							<Route path='/index/imageManagement' component={ImageManagement} />
							<Redirect to='/index/bills'  />
						</Switch>
					</div>
				</div>
            </div>  
        )
    }
}