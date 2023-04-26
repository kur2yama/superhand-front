import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        isLoading:false,
        headerTitle:'项目督办',
        setting:{}
    },
    mutations:{
        CHANGE_TITLE(state,txt){
            state.headerTitle = txt
        },
        UPDATE_SETTING(state,data){
            state.setting = data
        }
    },
    actions:{
        changeTitle(context,txt) {
            context.commit('CHANGE_TITLE',txt)
        },
        updateSetting(context,data) {
            context.commit('UPDATE_SETTING',data)
            document.title = data.share_title?data.share_title:'项目督办';
        }
    }
})

export default store