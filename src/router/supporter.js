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
        path: '/supporter/image-ai/recommend',
        name: 'SupporterImageAIResults',
        component: () => import('@/views/supporter/image-ai/SupporterImageAIRecommend.vue')
    },
    {
        path: '/supporter/image-ai/choice-plan',
        name: 'SupporterImageAIChoicePlan',
        component: () => import('@/views/supporter/image-ai/SupporterImageAIChoicePlan.vue')
    },
    {
        path: '/supporter/image-ai/select-plan',
        name: 'SupporterImageAISelectPlan',
        component: () => import('@/views/supporter/image-ai/SupporterImageAISelectPlan.vue')
    },
    {
        path: '/supporter/image-ai/complete-plan',
        name: 'SupporterImageAICompletePlan',
        component: () => import('@/views/supporter/image-ai/SupporterImageAICompletePlan.vue')
    },
    {
        path: '/supporter/restrooms',
        name: 'SupporterRestrooms',
        component: () => import('@/views/supporter/SupporterRestrooms.vue')
    },
    {
        path: '/supporter/checklist',
        name: 'SupporterChecklist',
        component: () => import('@/views/supporter/SupporterChecklist.vue')
    }
];

export default routes;