const routes = [
    {
        path: '/',
        redirect: '/supporter'
    },
    {
        path: '/supporter',
        name: 'SupporterMain',
        component: () => import('@/views/supporter/SupporterMain.vue')
    },
    {
        path: '/supporter/image-ai/history',
        name: 'SupporterImageAIHistory',
        component: () => import('@/views/supporter/image-ai/SupporterImageAIHistory.vue')
    },
    {
        path: '/supporter/image-ai/new-search',
        name: 'SupporterImageAINew',
        component: () => import('@/views/supporter/image-ai/SupporterImageAINew.vue')
    },
    {
        path: '/supporter/image-ai/img-type',
        name: 'SupporterImageAIType',
        component: () => import('@/views/supporter/image-ai/SupporterImageAIType.vue')
    },
    {
        path: '/supporter/image-ai/results',
        name: 'SupporterImageAIResults',
        component: () => import('@/views/supporter/image-ai/SupporterImageAIResults.vue')
    },
    {
        path: '/supporter/image-ai/add-plan',
        name: 'SupporterImageAIAddPlan',
        component: () => import('@/views/supporter/image-ai/SupporterImageAIAddPlan.vue')
    },
    {
        path: '/supporter/restrooms',
        name: 'SupporterRestrooms',
        component: () => import('@/views/supporter/SupporterRestrooms.vue')
    }
];

export default routes;