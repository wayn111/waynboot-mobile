const payTypeTextMap = {
  4: '支付宝',
  5: '微信支付',
  99: '测试支付',
}

export const formatYuan = (value) => {
  return Number(value || 0).toFixed(2)
}

export const getPayTypeText = (orderInfo = {}) => {
  const payType = Number(orderInfo.payType)
  return payTypeTextMap[payType] || orderInfo.payTypeText || '--'
}

export const buildOrderAmountRows = (orderInfo = {}) => {
  return [
    {
      label: '商品金额',
      value: `¥${formatYuan(orderInfo.orderPrice)}`,
    },
    {
      label: '运费',
      value: `¥${formatYuan(orderInfo.freightPrice)}`,
    },
    {
      label: '优惠券金额',
      value: `-¥${formatYuan(orderInfo.couponPrice)}`,
    },
    {
      label: '退款金额',
      value: `¥${formatYuan(orderInfo.refundAmount)}`,
    },
    {
      label: '实付金额',
      value: `¥${formatYuan(orderInfo.actualPrice)}`,
      emphasis: true,
    },
  ]
}
