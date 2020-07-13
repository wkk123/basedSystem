import React, { Component } from 'react';
import './index.css';

export default class HeaderCom extends Component{
	constructor(props){
        super(props);
		this.state = {
			sysTitle: '骠骑快修管理系统',
			showOut: false,
		}
    }
	
	showModal = () => {
		let showOut = !this.state.showOut
		this.setState({
			showOut
		})
	}
	
	logoutEvent = () => {
		sessionStorage.removeItem('token');
		this.props.history.replace({pathname: '/login'});
	}

    render(){
        return(
			<div className="header_box flex_box flex_between">
				<div className="logo_box">
					<span>
					{
						this.state.sysTitle.split('').map((item, index)=> {
							return <font key={index}>{item}</font>
						})
					}
					</span>
					<span>PIAO QI KUAI XIU MANAGEMENT</span>
				</div>
				<div className="user_name">
					<span onClick={e => this.showModal(e)}>admin</span>
				</div>
				{
					this.state.showOut && (
						<div className="logout" onClick={this.logoutEvent}>退出登录</div>
					)
				}
				
			</div>
        )
    }
}