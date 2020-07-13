import { get, post } from './http';

export const login = p => {
	return post('administrator/login', p)
}

export const onAuditWithdraw = p => {
	return post('withdrawal/audit', p)
}

export const getbillList = p => {
	return get('order/list', p)
}

export const getNearlyMaster = p => {
	return get('order/worker_candidates', p)
}

export const getAllNearlyMaster = p => {
	return get('assess/worker_candidates', p)
}

export const onAssignmentBill = p => {
	return post('order/assignment', p)
}

export const getWithdrawList = p => {
	return get('withdrawal/list', p)
}

export const getAssessList = p => {
	return get('assess/list', p)
}

export const onAssignmentAssess = p => {
	return post('assess/assignment', p)
}

export const onRefundment = p => {
	return post('order/refundment', p)
}

export const onRefundAssess = p => {
	return post('assess/refundment', p)
}

// 获取二手车商品列表
export const getGoodsList = p => {
	return get('goods/list', p)
}

// 商品置顶（二手车）
export const onGoodsStick = p => {
	return post('goods/top', p)
}

// 商品审核（二手车）
export const onGoodsAudit = p => {
	return post('goods/pass_or_fail', p)
}

// 商品下架（二手车）
export const onGoodsOffline = p => {
	return post('goods/offline', p)
}

