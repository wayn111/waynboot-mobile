import { computed, ref } from 'vue'

export const buildSelectedValuesFromInitial = (tree = [], initialSku = {}) => {
  const nextSelected = {}

  tree.forEach((spec) => {
    const selectedId = initialSku?.[spec.k_s]
    if (!selectedId) return

    const target = (spec.v || []).find((item) => item.id === selectedId)
    if (target) {
      nextSelected[spec.k_s] = target
    }
  })

  return nextSelected
}

export const createSkuState = (initialSku = {}) => {
  const selectedValues = ref({})
  const selectedNum = ref(initialSku?.selectedNum || 1)

  const selectedNames = computed(() => {
    return Object.values(selectedValues.value)
      .map((item) => item?.name)
      .filter(Boolean)
  })

  const syncSelectedFromInitial = (tree = [], nextInitialSku = {}) => {
    selectedValues.value = buildSelectedValuesFromInitial(tree, nextInitialSku)
    selectedNum.value = nextInitialSku?.selectedNum || 1
  }

  return {
    selectedValues,
    selectedNum,
    selectedNames,
    syncSelectedFromInitial,
  }
}
