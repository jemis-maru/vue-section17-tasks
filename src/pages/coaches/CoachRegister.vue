<template>
    <section>
        <base-card>
            <h2>Register as a coach!</h2>
            <coach-form @submit-data="formData"></coach-form>
        </base-card>
    </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';

    export default {
        components: {
            CoachForm
        },
        methods: {
            formData(data){
                this.$store.dispatch('coachModule/registerCoach', data);
                this.$router.replace('/coaches');
            }
        },
    }
</script>

<style scoped>

</style>