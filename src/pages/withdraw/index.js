import React, { Component } from 'react';
import { Modal } from 'antd';
import message from '../../utils/message';
import TableComponent from '../../components/tableCom';
import { getWithdrawList, onAuditWithdraw } from '../../http/api';
const { confirm } = Modal;

export default class Withdraw extends Component{
	constructor(props){
        super(props);
		this.state = {
			columns: [
			  {
				title: '提现人',
				dataIndex: 'user',
			  },
			  {
				title: '电话', 
				dataIndex: 'phone',
			  },
			  {
				title: '提现时间',
				dataIndex: 'time',
			  },
			  {
				title: '提现金额(元)',
				dataIndex: 'amount',
			  },
			  {
				title: '审核状态',
				dataIndex: 'statusText',
			  },
			  {
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<div>
						{
							record.status===0 && (
								<span className="span_btn_group">
									<span 
										className="span_btn pointer return_color"
										onClick={() => this.onAudit(record.id, 2)}>驳回</span>
									<span 
										className="span_btn pointer"
										onClick={() => this.onAudit(record.id, 1)}>通过</span>
								</span>
							)
						}
					</div>
				)
			  },
			],
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
		}
    }
	
	onPaginationChange = (current, pageSize)=> {
		let pagination = this.state.pagination
		pagination.current = current
		pagination.pageSize = pageSize
		this.setState({
			pagination: pagination
		})
	}
	
	componentDidMount(){
		this.fetchList(this.state.pagination.current, this.state.pagination.pageSize)
	}
	
	onAudit = (id, status) => {
		const that = this
		confirm({
			title: '操作提示',
			content: '请确认是否继续操作?',
			onOk() {
			  onAuditWithdraw({id: id, status: status}).then(res=> {
				  console.log(res)
				  if(res.code===10000){
					  message.success('操作成功')
					  that.fetchList(that.state.pagination.current, that.state.pagination.pageSize)
					  return
				  }
				  message.error(res.message)
			  })
			},
			onCancel() {},
		});
	}
	
	fetchList = (page, size) => {
		let { tableList, pagination } = this.state
		getWithdrawList({page: page, size: size}).then(res=> {
			if(res.code===10000){
				tableList = res.data.list.map((item, index) => {
					let value = {
						phone: item.worker.phone,
						time: item.withdrawal.createTime,
						amount: item.withdrawal.amount,
						status: item.withdrawal.status,
						statusText: item.withdrawal.status===0?'待审核':(item.withdrawal.status===1?'已通过':'已驳回'),
						user: item.worker.name,
						id: item.withdrawal.id,
						key: item.withdrawal.id
					}
					return value
				})
				pagination.total = res.data.count
				this.setState({
					tableList,
					pagination
				})
			}
		})
	}
	
    render(){
        return(
            <div className="container_wrap">
				<TableComponent
					columns={this.state.columns}
					data={this.state.tableList} 
					pagination={this.state.pagination}></TableComponent>
            </div>  
        )
    }
}


