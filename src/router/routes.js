
// const routes = [
//   {
//     path: '/RTK',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [
//       { path: '', component: () => import('pages/systemList.vue') },
//       {path: ':SN/:port/:host',
//       component: () => import('pages/mainScreen.vue'),
//       }
//     ]
//   },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/ErrorNotFound.vue')
//   }
// ]

// export default routes
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/systemList.vue') },
      {path: 'RTK/:SN?/:port?/:host?/:name?/:mode?',
      component: () => import('pages/mainScreen copy.vue'),
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
