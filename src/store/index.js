import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        isLoading:false,
        headerTitle:'项目督办'
    },
    mutations:{
        CHANGE_TITLE(state,txt){
            state.headerTitle = txt
        }
    },
    actions:{
        changeTitle(context,txt) {
            context.commit('CHANGE_TITLE',txt)
        }
    }
})

export default store