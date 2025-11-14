import EditProfile from '@/views/mypage/EditProfile.vue';
import MyProfile from '@/views/mypage/MyProfile.vue'


const routes=[
    {
    path: '/mypage',
    name: 'MyProfile',
    component: MyProfile,
  },
  {
    path: '/mypage/edit',
    name: 'EditProfile',
    component: EditProfile,
  },
];

export default routes;