import { createStore } from "vuex";
import coaches from "./modules/coaches/coaches.js";
import requests from "./modules/requests/requests.js";
import auth from "./modules/auth/auth.js";

const store = createStore({
    modules: {
        coachModule: coaches,
        requestModule: requests,
        authModule: auth,
    },
});

export default store;