const getters = {
  // base info
  id: (state) => state.user.id,
  name: (state) => state.user.name,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,

  // address
  addressList: (state) => state.address.addressList,
  selectedAddress: (state) => state.address.selectedAddress,

  // search
  searchKey: (state) => state.search.searchKey
}

export default getters
