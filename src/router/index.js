import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import ('../components/Home.vue'),
        children: [{
                path: '/info',
                name: 'Info',
                component: () =>
                    import ('../views/InfoPage.vue')
            },
            {
                path: '/user',
                name: 'User',
                component: () =>
                    import ('../views/UserPage.vue')
            },
            {
                path: '/feedback',
                name: 'Feedback',
                component: () =>
                    import ('../views/FeedbackPage.vue')
            },
            {
                path: '/infoStatistics',
                name: 'InfoStatistics',
                component: () =>
                    import ('../views/InfoStatisticsPage.vue')
            },
            {
                path: '/scenery',
                name: 'Scenery',
                component: () =>
                    import ('../views/SceneryPage.vue')
            },
            {
                path: '/casual',
                name: 'Casual',
                component: () =>
                    import ('../views/CasualPage.vue')
            },
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router