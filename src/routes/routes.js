import Login from '@/pages/login';
import Index from '@/pages/index';

const routes = [
  {
    path:'/',
    component: Login,
    title: '登录',
    exact: true,
  },
  {
    path: '/index',
    component: Index,
    title: '',
    exact: false,
  },
]
export default routes;
