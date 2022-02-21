import { createRouter, createWebHistory } from 'vue-router';
import CoachesList from './pages/coaches/CoachesList.vue';
import CoachDetails from './pages/coaches/CoachDetails.vue';
import CoachRegister from './pages/coaches/CoachRegister.vue';
import ContactCoach from './pages/requests/ContactCoach.vue';
import ReceivedRequest from './pages/requests/ReceivedRequest.vue';
import NotFound from './pages/NotFound.vue';
import UserAuth from './pages/auth/UserAuth.vue';
import store from "./store/index.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/coaches',
        },
        {
            path: '/coaches',
            component: CoachesList,
        },
        {
            path: '/coaches/:id',
            component: CoachDetails,
            props: true,
            children: [
                {
                    path: 'contact',
                    component: ContactCoach,
                },
            ],
        },
        {
            path: '/register',
            component: CoachRegister,
            meta: {
                requiredAuth: true,
            },
        },
        {
            path: '/requests',
            component: ReceivedRequest,
            meta: {
                requiredAuth: true,
            },
        },
        {
            path: '/auth',
            component: UserAuth,
            meta: {
                requiredUnauth: true,
            },
        },
        {
            path: '/:notfound(.*)',
            component: NotFound,
        },
    ],
});

router.beforeEach(function(to, _, next){
    if(to.meta.requiredAuth && !store.getters.isAuth){
        next('/auth');
    }
    else if(to.meta.requiredUnauth && store.getters.isAuth){
        next('/coaches');
    }
    else{
        next();
    }
});

export default router;