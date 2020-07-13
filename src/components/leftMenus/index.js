import React, { Component } from 'react';
import {  NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import './index.css';

export default class LeftNavMenu extends Component{
	constructor(props){
        super(props);
		this.state = {
			path: '/index/bills',
		}
    }

    render(){
        return(
			<div className="asideNav">
				<Menu
				  defaultSelectedKeys={[this.props.path]}
				  selectedKeys={[this.props.path]}
				  mode="vertical"
				  theme="dark"
				>
				  {
				  	this.props.leftMenuList.map((item, index)=> {
				  		return (
				  			<Menu.Item key={item.path}>
				  				<NavLink to={item.path}>
				  					<span>
				  						{item.title}
				  					</span>
				  				</NavLink>
				  			</Menu.Item>
				  		)
				  	})
				  }
				</Menu>
			</div>
        )
    }
}