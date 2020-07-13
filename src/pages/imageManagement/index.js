import React, { Component } from 'react';
import { Modal } from 'antd';
import TableComponent from '../../components/tableCom';
import message from '../../utils/message';
import { getGoodsList, onGoodsStick, onGoodsAudit, onGoodsOffline } from '../../http/api';
import './index.css';

const { confirm } = Modal;
export default class Assessment extends Component{
	constructor(props){
		super(props);
		this.state = {
			columns: [//表格导航内容
			  {
				title: '发布人',
				dataIndex: 'publisher',
			  },
			  {
				title: '联系方式',
				dataIndex: 'phone',
			  },
			  {
				title: '区域', 
				dataIndex: 'area',
			  },
			  {
				title: '发布时间',
				dataIndex: 'createTime',
			  },
			  {
				title: '内容',
				dataIndex: 'details',
				render: (text, record) => (
					<span className="span_btn_group">
						<span
							className="span_btn pointer"
							onClick={() => this.btnDetails(record.details)}>详情(点击查看)</span>
					</span>
				)
			  },
			  {
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<span className="span_btn_group">
						<span
							className="span_btn pointer" 
							onClick={() => this.showConfirm(1,record.id)}>下架</span>
						<span
							className="span_btn pointer" 
							onClick={() => this.showConfirm(2,record.id)}>审核</span>
						<span
							className="span_btn pointer" 
							onClick={() => this.showConfirm(3,record.id)}>置顶</span>
					</span>
				)
			  },
			],
			tableList: [],//表格数据
			pagination: {//分页导航信息
				size: 'small',
				showSizeChanger: true,
				showQuickJumper: true,
				total: 0,
				pageSize: 10, 
				current: 1,
				showTotal: total => `共 ${total} 条`,
				onChange: this.onPaginationChange,
				onShowSizeChange: this.onPaginationChange
			},
			visible: false,//详情是否显示
			imageList:[],//详情图片列表
		}
    }
	// 分页导航操作
	onPaginationChange = (current, pageSize)=> {
		let pagination = this.state.pagination
		pagination.current = current
		pagination.pageSize = pageSize
		this.fetchGoodsList(current, pageSize)
		this.setState({
			pagination: pagination
		})
	}
	
	componentDidMount(){
		this.fetchGoodsList(this.state.pagination.current, this.state.pagination.pageSize)
	}
	// 获取商品列表(二手车)
	fetchGoodsList = (page, size) => {
		let { tableList, pagination } = this.state
		getGoodsList({page: page, size: size}).then(res=> {
			if(res.code===10000){
				tableList = res.data.goods.map((item, index) => {
					let info = {
						publisher: item.user.nickname,
						phone: item.user.phone,
						area: item.goods.province+item.goods.location+item.goods.district,
						createTime: item.goods.createTime,
						details: item.goods.img,
						key: item.goods.id,
						id: item.goods.id,
					}
					return info
				}) 
				pagination.total = res.data.count
				this.setState({
					tableList,
					pagination
				})
			} 
		})
	}
	// 点击详情
	btnDetails = (List) => {
		this.setState({
			visible: true,
			imageList: List,
		})
	}
	// 操作
	showConfirm = (type, id) => {
		const that = this;
		confirm({
			content: type === 1?'交易记录下架后无法在小程序显示,请谨慎处理':(type === 2?'发布信息通过后将在【二手车】列表展示':'信息置顶后将展示在【二手车】列表最上面'),
			okText: type === 1?'确定下架':(type === 2?'通过':'置顶'),
			cancelText: type === 1?'取消':(type === 2?'不通过':'再想想'),
			onOk() {
				if(type === 2){
					that.operation(type, id, 1);
				} else {
					that.operation(type, id);	
				}
			},
			onCancel() {
			  if(type === 2){
					that.operation(type, id, -1);
				}
			},
		});
	}
	//操作
	operation = (type, id, status) => {
		if(type === 1){//商品id
			onGoodsOffline({id: id}).then(res=> {
				if(res.code===10000){
					message.success('操作成功')
					return
				}
				message.error(res.message)
			});
		} else if(type === 2){//通过1，不通过-1
			onGoodsAudit({id: id, status: status}).then(res=> {
				if(res.code===10000){
					message.success('操作成功')
					return
				}
				message.error(res.message)
			});
		} else if(type === 3){//下架//1置顶，0取消置顶
			onGoodsStick({id: id, status: 1}).then(res=> {
				if(res.code===10000){
					message.success('操作成功')
					return
				}
				message.error(res.message)
			});
		}
	}
	// 关闭图片弹框
	handleCancel = () => {
		this.setState({ 
			visible: false
		});
	}
	
	render(){
			const { visible, imageList } = this.state;
			return(
					<div className="container_wrap">
						<TableComponent
							columns={this.state.columns}
							data={this.state.tableList} 
							pagination={this.state.pagination}>
						</TableComponent>
						<Modal
        		  visible={visible}
        		  title="介绍信息"
							onCancel={this.handleCancel}
							footer={null}
        		>
        		  <div className="modal_main_box">
								{
									imageList.map((item, index)=> {
										return (
											<div className="list_items flex_box align_items_center" key={'id'+index}>
												<img className="introduce" src={item} alt={'id'+index}/>
											</div>
										)
									})
								}
							</div>
        		</Modal>
					</div>  
			)
	}
}
