import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  id: '',
  name: '',
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, info) => {
    state.userInfo = info
    state.id = info.id
    state.name = info.nickname
  }
}

const actions = {
  async login({ commit }, { mobile, yzm }) {
    const { data } = await login({ mobile, yzm })
    commit('SET_TOKEN', data)
    setToken(data)
  },

  async logout({ commit }) {
    await logout()
    commit('SET_TOKEN', '')
    removeToken()
  },

  async getInfo({ commit }) {
    const { data } = await getInfo()
    if (!data) throw new Error('获取基本信息失败，请重新登录')
    commit('SET_USER_INFO', data)
    return data
  },

  resetToken({ commit }) {
    commit('SET_TOKEN', '')
    removeToken()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
