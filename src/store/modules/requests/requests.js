export default {
    namespaced: true,
    state(){
        return{
            requests: []
        };
    },
    mutations: {
        addRequests(state, payload){
            state.requests.push(payload);
        },
        setRequests(state, payload){
            state.requests = payload;
        },
    },
    actions: {
        async contactCoach(context, payload){
            const newReq = {
                userEmail: payload.email,
                userMessage: payload.message,
            };

            const response = await fetch(process.env.VUE_APP_SERVER_URL + `requests/${payload.coachId}.json`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newReq),
            });
    
            const responseData = await response.json();

            // if(!response.ok){
            //     const err = new Error(responseData.message || 'Failed to send');
            // }
    
            console.log(responseData);
            newReq.id = responseData.name;
            newReq.coachId = payload.coachId;

            context.commit('addRequests', newReq);
        },
        async fetchRequests(context){
            const coachId = context.rootGetters.userId;
            const token = context.rootGetters.token;
            const response = await fetch(process.env.VUE_APP_SERVER_URL + `requests/${coachId}.json?auth=${token}`);
            const responseData = await response.json();
            if(!response.ok){
                const err = new Error(responseData.message || 'Failed to fetch!');
                throw err;
            }
            const requests = [];
            for(let key in responseData){
                const request = {
                    id: key,
                    coachId: coachId,
                    userEmail: responseData[key].userEmail,
                    userMessage: responseData[key].userMessage,
                };
                requests.push(request);
            }
            context.commit('setRequests', requests);
        },
    },
    getters: {
        requests(state, _, _2, rootGetters){
            const coachId = rootGetters.userId;
            return state.requests.filter(req => {
                return req.coachId === coachId;
            });
        },
        hasRequests(_, getters){
            if(getters.requests.length>0){
                return true;
            }
            else{
                return false;
            }
        },
    },
};