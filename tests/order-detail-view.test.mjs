import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildOrderAmountRows,
  getPayTypeText,
} from '../src/views/order/detail/order-detail-view.mjs'

test('pay type 99 is displayed as test payment', () => {
  assert.equal(getPayTypeText({ payType: 99 }), '测试支付')
})

test('amount rows include coupon price discount', () => {
  const rows = buildOrderAmountRows({
    orderPrice: 128,
    freightPrice: 6,
    couponPrice: 1,
    refundAmount: 0,
    actualPrice: 133,
  })

  assert.deepEqual(rows.map((item) => [item.label, item.value]), [
    ['商品金额', '¥128.00'],
    ['运费', '¥6.00'],
    ['优惠券金额', '-¥1.00'],
    ['退款金额', '¥0.00'],
    ['实付金额', '¥133.00'],
  ])
})
