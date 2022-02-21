<template>
    <base-dialog :show="!!isError" title="Error" @close="closeDialog">
        <p>{{ isError }}</p>
    </base-dialog>
    <section>
        <base-card>
            <header>
                <h2>Requests received</h2>
            </header>
            <div v-if="isLoading">
                <base-spinner></base-spinner>
            </div>
            <ul v-else-if="hasRequests">
                <request-item 
                 v-for="req in receivedReqests" 
                :key="req.coachId"
                :email="req.userEmail"
                :message="req.userMessage"></request-item>
            </ul>
            <h3 v-else>No requests found!</h3>
        </base-card>
    </section>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';

    export default {
        components: { RequestItem },
        data(){
            return{
                isLoading: false,
                isError: null,
            };
        },
        computed: {
            receivedReqests(){
                return this.$store.getters['requestModule/requests'];
            },
            hasRequests(){
                return this.$store.getters['requestModule/hasRequests'];
            },
        },
        methods: {
            async loadRequests(){
                this.isLoading = true;
                try{
                    await this.$store.dispatch('requestModule/fetchRequests');
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
        created() {
            this.loadRequests();
        },
    }
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>