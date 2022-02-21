<template>
    <base-dialog :show="!!isError" title="Error" @close="closeDialog">
        <p>{{ isError }}</p>
    </base-dialog>
    <section>
        <coach-filter @change-filter="setFilter"></coach-filter>
    </section>
    <section>
        <base-card>
            <div class="controls">
                <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
                <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">Login to register as a coach</base-button>
                <base-button v-if="!isCoach && !isLoading && isLoggedIn" link to="/register">Register as a coach</base-button>
            </div>
            <div v-if="isLoading">
                <base-spinner></base-spinner>
            </div>
            <ul v-else-if="hasCoaches">
                <!-- <li v-for="coach in filterCoaches" :key="coach.id">{{coach.firstName}}</li> -->
                <coach-item
                v-for="coach in filterCoaches"
                :key="coach.id"
                :id="coach.id"
                :firstName="coach.firstName"
                :lastName="coach.lastName"
                :rate="coach.hourlyRate"
                :areas="coach.areas">
                </coach-item>
            </ul>
            <h3 v-else>No coaches found!</h3>
        </base-card>
    </section>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
    components: {
        CoachItem,
        CoachFilter,
    },
    data(){
        return{
            isLoading: false,
            isError: null,
            activeFilters: {
                frontend: true,
                backend: true,
                career: true,
            },
        };
    },
    methods: {
        setFilter(updatedFilter){
            this.activeFilters = updatedFilter;
        },
        async loadCoaches(refresh = false){
            this.isLoading = true;
            try{
                await this.$store.dispatch('coachModule/loadCoaches', {forceRefresh: refresh});
            }
            catch(err){
                this.isError = err.message || 'Something went wrong!';
            }
            this.isLoading = false;
        },
        closeDialog(){
            this.isError = null;
        },
    },
    computed: {
        isCoach(){
            return this.$store.getters['coachModule/isCoach'];
        },
        filterCoaches(){
            const coaches = this.$store.getters['coachModule/coaches'];
            return coaches.filter(coach => {
                if(this.activeFilters.frontend && coach.areas.includes('frontend')){
                    return true;
                }
                if(this.activeFilters.backend && coach.areas.includes('backend')){
                    return true;
                }
                if(this.activeFilters.career && coach.areas.includes('career')){
                    return true;
                }
                return false;
            });
        },
        hasCoaches(){
            return !this.isLoading && this.$store.getters['coachModule/hasCoaches'];
        },
        isLoggedIn(){
            return this.$store.getters.isAuth;
        },
    },
    created() {
        this.loadCoaches();
    },
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>