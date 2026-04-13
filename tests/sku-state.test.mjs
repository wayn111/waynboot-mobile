import test from 'node:test'
import assert from 'node:assert/strict'

import { createSkuState } from '../src/views/detail/modules/skuState.mjs'

const skuTree = [
  {
    k: '规格',
    k_s: 's1',
    v: [
      { id: 11, name: '1.5m床垫*1+枕头*2' },
      { id: 12, name: '1.8m床垫*1+枕头*2' },
    ],
  },
  {
    k: '颜色',
    k_s: 's2',
    v: [
      { id: 21, name: '浅杏粉' },
      { id: 22, name: '玛瑙红' },
    ],
  },
]

test('syncSelectedFromInitial keeps selected sku values and quantity reactive', () => {
  const { selectedValues, selectedNum, selectedNames, syncSelectedFromInitial } = createSkuState()

  syncSelectedFromInitial(skuTree, {
    s1: 12,
    s2: 22,
    selectedNum: 3,
  })

  assert.deepEqual(Object.keys(selectedValues.value), ['s1', 's2'])
  assert.equal(selectedValues.value.s1.name, '1.8m床垫*1+枕头*2')
  assert.equal(selectedValues.value.s2.name, '玛瑙红')
  assert.equal(selectedNum.value, 3)
  assert.deepEqual(selectedNames.value, ['1.8m床垫*1+枕头*2', '玛瑙红'])
})
