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
        children: [
          {
                path: '/sceneryManagement',
                name: 'SceneryManagement',
                component: () =>
                    import ('../views/SceneryManagement.vue')
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
                path: '/scenery',
                name: 'Scenery',
                component: () =>
                    import ('../views/SceneryPage.vue')
            },
            {
              path: '/infoStatistics',
              name: 'InfoStatistics',
              component: () =>
                import ('../views/InfoStatistics.vue')
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
