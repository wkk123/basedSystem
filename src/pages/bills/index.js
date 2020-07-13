import React, { Component } from 'react';
import { Modal, Button, Checkbox } from 'antd';
import TableComponent from '../../components/tableCom';
import message from '../../utils/message';
import { getbillList, getNearlyMaster, onAssignmentBill, onRefundment } from '../../http/api';
import './index.css';
const { confirm } = Modal;

export default class Bills extends Component{
	constructor(props){
        super(props);
		this.state = {
			visible: false,
			checked: false,
			columns: [
			  {
				title: '用户电话',
				dataIndex: 'phone_u',
			  },
			  {
				title: '发单时间', 
				dataIndex: 'sendTime',
			  },
			  {
				title: '发单地址',
				dataIndex: 'sendAddress',
			  },
			  {
				title: '订单状态',
				dataIndex: 'statusText',
			  },  
			  {
				title: '支付状态',
				dataIndex: 'payText',
			  },
			  {
				title: '师傅名称',
				dataIndex: 'principal',
			  },
			  {
				title: '师傅电话',
				dataIndex: 'phone_m',
			  },
			  {
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<span className="span_btn_group">
						{
							record.status===3&&(record.refundStatus===1||record.refundStatus===4) && (
								<span
									className="span_btn pointer" 
									onClick={() => this.showConfirm(record.id)}>退款</span>
							)
						}
						{
							record.status===1&&(
								<span
									className="span_btn pointer" 
									onClick={() => this.showModal(record.id)}>分配订单</span>
							)
						}
						
					</span>
				)
			  },
			],
			masterList: [],
			tableList: [],
			pagination: {
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
			orderId: null
		}
    }
	
	onPaginationChange = (current, pageSize)=> {
		let pagination = this.state.pagination
		pagination.current = current
		pagination.pageSize = pageSize
		this.fetchBill(current, pageSize)
		this.setState({
			pagination: pagination
		})
	}
	
	componentDidMount(){
		this.fetchBill(this.state.pagination.current, this.state.pagination.pageSize)
	}
	
	fetchBill = (page, size) => {
		let { tableList, pagination } = this.state
		getbillList({page: page, size: size}).then(res=> {
			if(res.code===10000){
				tableList = res.data.list.map((item, index) => {
					let statusText = '已完成';
					let payText = '未支付';
					
					if(item.order.status===0) statusText = '已取消';
					if(item.order.status===1) statusText = '待接单';
					if(item.order.status===2) statusText = '已接单';
					
					if(item.order.refundStatus===1) payText = '已支付';
					if(item.order.refundStatus===2) payText = '退款审核中';
					if(item.order.refundStatus===3) payText = '已退款';
					if(item.order.refundStatus===4) payText = '退款失败';
					let info = {
						status: item.order.status,
						statusText: statusText,
						phone_m: item.worker.phone,
						sendTime: item.order.createTime,
						sendAddress: item.order.location,
						principal: item.worker.name,
						phone_u: item.user.phone,
						key: item.order.id,
						id: item.order.id,
						uid: item.user.id,
						mid: item.worker.id,
						refundStatus: item.order.refundStatus,
						payText: payText
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
	
	showModal(id){
		let { masterList } = this.state
		getNearlyMaster({id: id}).then(res=> {
			if(res.code===10000){
				masterList = res.data.list.map((item, index) => {
					item['checked'] = false
					return item
				})
				this.setState({
					orderId: id,
					visible: true,
					masterList
				})
			}else{
				message.error(res.message);
			}
		})
	}
	
	filterSelectedMaster(){
		let isSelected = false
		this.state.masterList.forEach(item=> {
			if(item.checked) isSelected = item.id
		})
		return isSelected
	}
	
	showConfirm = id => {
		const that = this
		confirm({
			title: '操作提示',
			content: '请确认是否要退款?',
			onOk() {
			  that.returnMoney(id)
			},
			onCancel() {
			  
			},
		});
	}
	
	returnMoney(id){
		onRefundment({orderId: id}).then(res=> {
			console.log(res)
			if(res.code === 10000){
				this.fetchBill(this.state.current, this.state.pageSize)
				message.success('操作成功')
				return
			}
			message.error(res.message)
		})
	}

	handleOk = () => {
		let workerId = this.filterSelectedMaster()
		if(!workerId){
			message.error('请勾选师傅');
			return
		}
		onAssignmentBill({
			orderId: this.state.orderId,
			workerId: workerId
		}).then(res=> {
			if(res.code===10000){
				this.fetchBill(this.state.current, this.state.pageSize)
				message.success('操作成功')
				this.setState({ visible: false });
				return
			}
			message.error(res.message)
		})
		
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};
	
	onChange = (index, e) => {
		let { masterList } = this.state
		masterList = masterList.map((item, idx) => {
			item.checked = false
			if(index===idx){
				item.checked = true
			}
			return item
		})
		this.setState({
			masterList
		})
	}
	
    render(){
		const { masterList, visible } = this.state;
        return(
            <div className="container_wrap">
				<TableComponent
					columns={this.state.columns}
					data={this.state.tableList} 
					pagination={this.state.pagination}></TableComponent>
				<Modal
				  visible={visible}
				  title="附近师傅"
				  onCancel={this.handleCancel}
				  footer={[
					<Button 
						key="submit" 
						type="primary" 
						onClick={this.handleOk}>
					  分配勾选师傅接单
					</Button>
				  ]}
				>
				  <div className="modal_main_box">
					{
						masterList.map((item, index)=> {
							return (
								<div className="list_item flex_box align_items_center" key={item.id}>
									<div className="avatar">
										<img src={item.avatar} alt=""/>
									</div>
									<div className="info">
										<div>
											<span className="master_name">{item.name}</span>
										</div>
										<div className="flex_box connect_way">
											<span>联系方式: {item.phone}</span>
											<span>距离: {item.distance}km</span>
										</div>
									</div>
									<div className="checkd_box">
										<Checkbox 
											checked={item.checked}
											onChange={e => this.onChange(index, e)}></Checkbox>
									</div>
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
