export default {
    namespaced: true,
    state(){
        return{
          lastFetch: null,
          coaches: [
              {
                id: 'c1',
                firstName: 'Maximilian',
                lastName: 'Schwarzmüller',
                areas: ['frontend', 'backend', 'career'],
                description:
                  "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
                hourlyRate: 30
              },
              {
                id: 'c2',
                firstName: 'Julie',
                lastName: 'Jones',
                areas: ['frontend', 'career'],
                description:
                  'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
                hourlyRate: 30
              }
          ],
        };
    },
    mutations: {
      registerCoach(state, payload){
        state.coaches.push(payload);
      },
      setCoaches(state, payload){
        state.coaches = payload;
      },
      setFetchTimeStamp(state){
        state.lastFetch = new Date().getTime();
      },
    },
    actions: {
      async registerCoach(context, data){
        const userId = context.rootGetters.userId;
        const newCoach = {
          firstName: data.first,
          lastName: data.last,
          areas: data.areas,
          description: data.desc,
          hourlyRate: data.rate,
        };

        const token = context.rootGetters.token;

        const response = await fetch(process.env.VUE_APP_SERVER_URL + `coaches/${userId}.json?auth=${token}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newCoach),
        });

        const responseData = await response.json();

        console.log(responseData);

        // if(!response.ok){

        // }

        context.commit('registerCoach', {
          ...newCoach,
          id: userId
        });
      },
      async loadCoaches(context, payload){
        if(!payload.forceRefresh && !context.getters.shouldUpdate){
          return;
        }
        const response = await fetch(process.env.VUE_APP_SERVER_URL + `coaches.json`);
        const responseData = await response.json();
        if(!response.ok){
          const err = new Error(responseData.message || 'Failed to fetch!');
          throw err;
        }
        const coaches = [];
        for(let key in responseData){
          const coach = {
            id: key,
            firstName: responseData[key].firstName,
            lastName: responseData[key].lastName,
            areas: responseData[key].areas,
            description: responseData[key].description,
            hourlyRate: responseData[key].hourlyRate,
          };
          coaches.push(coach);
        }
        context.commit('setCoaches', coaches);
        context.commit('setFetchTimeStamp');
      },
    },
    getters: {
        coaches(state){
            return state.coaches;
        },
        hasCoaches(state){
            return state.coaches && state.coaches.length > 0;
        },
        isCoach(_, getters, _2, rootGetters){
          const coaches = getters.coaches;
          const userId = rootGetters.userId;
          return coaches.some(coach => {
            return coach.id === userId;
          });
        },
        shouldUpdate(state){
          const fetchTime = state.lastFetch;
          if(!fetchTime){
            return true;
          }
          const currentTime = new Date().getTime();
          return (currentTime - fetchTime) / 1000 > 60;
        },
    },
};