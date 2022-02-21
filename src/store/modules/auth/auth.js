let timer;

export default {
    state(){
        return{
            userId: null,
            token: null,
            didAutoLogout: false,
        };
    },
    mutations: {
        setUser(state, payload){
            state.token = payload.token;
            state.userId = payload.userId;
            state.didAutoLogout = false;
        },
        didAutoLogout(state){
            state.didAutoLogout = true;
        },
    },
    actions: {
        async signUp(context, payload){
            return context.dispatch('auth', {
                ...payload,
                mode: 'signUp',
            });
        },
        async login(context, payload){
            return context.dispatch('auth', {
                ...payload,
                mode: 'login',
            });
        },
        async auth(context, payload){
            const mode = payload.mode;
            let serverUrl = process.env.VUE_APP_LOGIN_URL;
            if(mode === 'signUp'){
                serverUrl = process.env.VUE_APP_SIGNUP_URL;
            }
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                }),
            });

            const responseData = await response.json();
            
            if(!response.ok){
                console.log(responseData);
                const error = new Error(responseData.message || 'Authentication failed!');
                throw error;
            }
            
            console.log(responseData);

            const expiresIn = +responseData.expiresIn * 1000;
            // const expiresIn = 5000;
            const expirationDate = new Date().getTime() + expiresIn;

            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
            localStorage.setItem('tokenExpiration', expirationDate);

            timer = setTimeout(function(){
                context.dispatch('autoLogout');
            }, expiresIn);

            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
            });
        },
        autoLogin(context){
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const tokenExpiration = localStorage.getItem('tokenExpiration');

            const expiresIn = +tokenExpiration - new Date().getTime();

            if(expiresIn < 0){
                return;
            }

            timer = setTimeout(function(){
                context.dispatch('autoLogout');
            }, expiresIn);

            if(token && userId){
                context.commit('setUser', {
                    token: token,
                    userId: userId,
                });
            }
        },
        logout(context){
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenExpiration');
            clearTimeout(timer);
            context.commit('setUser', {
                token: null,
                userId: null,
            });
        },
        autoLogout(context){
            context.dispatch('logout');
            context.commit('didAutoLogout');
        },
    },
    getters: {
        userId(state){
            return state.userId;
        },
        token(state){
            return state.token;
        },
        isAuth(state){
            return !!state.token;
        },
        didAutoLogout(state){
            return state.didAutoLogout;
        },
    },
};